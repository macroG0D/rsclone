import Phaser from 'phaser';
import Emitter from '../utils/emitter';

import {
  DEFAULT_MASS,
  DEFAULT_FRICTION,
  DEFAULT_FRICTION_AIR,
  CONTROL_KEYS_SEQUENCE,
  CHARACTERS_DISTANCE_MAX,
} from '../constants';

import { playSound } from '../utils/sound';

function createPlayerAnimations(scene, key, sprite) {
  scene.anims.create({
    key: `move-${key}`,
    frames: scene.game.anims.generateFrameNumbers(sprite),
    frameRate: 62,
    repeat: -1,
  });
}
export default class Player extends Phaser.Physics.Matter.Sprite {
  constructor(scene, key, x, y, sprite, controls) {
    super(scene.matter.world, x, y, sprite);
    this.scene = scene;
    this.portals = this.scene.portals;
    this.key = key;
    this.isGrounded = false;
    this.isCarrying = false;
    this.isHeadStanding = false;
    // Jumping is going to have a cooldown
    this.canJump = true;
    this.jumpCooldownTimer = null;
    const { Body, Bodies } = Phaser.Physics.Matter.Matter;
    const { width: w, height: h } = this;
    const mainBody = Bodies.rectangle(0, 0, w * 0.75, h, {
      chamfer: { radius: 1 },
    });
    this.sensors = {
      center: Bodies.rectangle(0, 0, 10, 10, { isSensor: true }),
      top: Bodies.rectangle(0, h - h * 1.48, w * 0.5, 5, { isSensor: true }),
      bottom: Bodies.rectangle(0, h * 0.48, w * 0.5, 5, { isSensor: true }),
      left: Bodies.rectangle(-w * 0.45, 0, 5, h * 0.4, { isSensor: true }),
      right: Bodies.rectangle(w * 0.45, 0, 5, h * 0.4, { isSensor: true }),
    };

    const compoundBody = Body.create({
      parts: [
        mainBody,
        this.sensors.center,
        this.sensors.top,
        this.sensors.bottom,
        this.sensors.left,
        this.sensors.right,
      ],
      frictionAir: DEFAULT_FRICTION_AIR,
      friction: DEFAULT_FRICTION,
      mass: DEFAULT_MASS,
    });
    this
      .setExistingBody(compoundBody)
      .setFixedRotation() // disable spin around its mass center point
      .setPosition(x, y);
    this.sprite = sprite;
    createPlayerAnimations(this.scene, this.key, this.sprite);

    this.controls = [];
    [this.controls.left, this.controls.right, this.controls.up] = controls;
    this.jumpVelocity = 14; // jump velocity moved to player class
    this.disableGravitySwitch = false; // additional flag
    this.scene.add.existing(this);

    this.controls = {};
    controls.forEach((controlKey, controlIndex) => {
      const direction = CONTROL_KEYS_SEQUENCE[controlIndex];
      this.controls[direction] = this.scene
        .input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[controlKey]);
    });

    this.scene.events.on('update', this.update, this);

    // Track which sensors are touching something
    this.isTouching = {
      left: false,
      right: false,
      top: false,
      bottom: false,
      center: false,
    };

    // Before matter's update, reset record of what surfaces the player is touching.
    scene.matter.world.on('beforeupdate', this.resetTouching, this);

    // If a sensor just started colliding with something, or it continues to collide with something,
    // call onSensorCollide
    scene.matterCollision.addOnCollideStart({
      objectA: [this.sensors.bottom, this.sensors.top, this.sensors.left, this.sensors.right],
      callback: this.onSensorCollide,
      context: this,
    });

    scene.matterCollision.addOnCollideActive({
      objectA: [this.sensors.bottom, this.sensors.top, this.sensors.left, this.sensors.right],
      callback: this.onSensorCollide,
      context: this,
    });

    this.portals.forEach((portal) => {
      this.portalsListeners(scene, portal);
    });
    this.emitter = new Emitter(scene, this, 'bubble', 2000);
    this.setInteractive();
    this.on('pointerdown', function () {
      this.emitter.emitParticles(100);
    });
  }

  fixedPositionOnHead() {
    const secondCharacterKey = this.getSecondCharacterKey();
    if (this.isHeadStanding) this.x = this.scene[secondCharacterKey].x;
  }

  detachPositionOnHead() {
    if (this.isHeadStanding) {
      const bottomChar = this.getSecondCharacterKey();
      this.scene[bottomChar].canJump = false;
      this.isHeadStanding = false;
      this.jumpCooldownTimer = this.scene.time.addEvent({
        delay: 150,
        // eslint-disable-next-line no-return-assign
        callback: () => (this.scene[bottomChar].canJump = true),
      });
    }
  }

  getSecondCharacterKey() {
    return this.key === 'ibb' ? 'obb' : 'ibb';
  }

  // check if one player is standing on the second's head and update their statuses
  headStandingCheck() {
    const secondCharacterKey = this.getSecondCharacterKey();
    function isOnHead() {
      this.isHeadStanding = true;
      this.scene[secondCharacterKey].isCarrying = true;
    }
    function isNotOnHead() {
      this.isHeadStanding = false;
      this.scene[secondCharacterKey].isCarrying = false;
    }
    this.scene.matterCollision.addOnCollideStart({
      objectA: this.sensors.bottom,
      objectB: this.scene[secondCharacterKey].sensors.top,
      callback: isOnHead,
      context: this,
    });
    this.scene.matterCollision.addOnCollideEnd({
      objectA: this.sensors.bottom,
      objectB: this.scene[secondCharacterKey].sensors.top,
      callback: isNotOnHead,
      context: this,
    });
  }

  onSensorCollide({ bodyA, bodyB, pair }) { // may use pair as third argument
    if (bodyB.isSensor) return; // We only care about collisions with physical objects
    if (bodyA === this.sensors.left) {
      this.isTouching.left = true;
      // optional solution for wall friction
      if (pair.separation > 0.5) this.x += pair.separation - 0.5;
    } else if (bodyA === this.sensors.right) {
      this.isTouching.right = true;
      // optional solution for wall friction
      if (pair.separation > 0.5) this.x -= pair.separation - 0.5;
    } else if (bodyA === this.sensors.top) {
      this.isTouching.top = true;
    } else if (bodyA === this.sensors.bottom) {
      this.isTouching.bottom = true;
    }
  }

  resetTouching() {
    this.isTouching.left = false;
    this.isTouching.right = false;
    this.isTouching.top = false;
    this.isTouching.bottom = false;
    this.isTouching.center = false;
  }

  noWallsFriction() {
    if (!this.isTouching.bottom) {
      this.body.friction = 0;
    } else {
      this.body.friction = 0.02;
    }
  }

  update() {
    this.isGrounded = this.isTouching.bottom;
    this.headStandingCheck();
    this.fixedPositionOnHead();
    this.noWallsFriction();
    this.movePlayer(this.key);
  }

  portalsListeners(scene, portal) {
    scene.matterCollision.addOnCollideStart({
      objectA: [this.sensors.center],
      objectB: portal,
      callback: () => (this.portalDive(portal)),
      context: this,
    });
  }

  portalDive(portal) {
    portal.emitParticles(this.x, this.width, this.body.velocity.y, this.flipY);
    setTimeout(() => {
      this.switchGravity();
      playSound(this.scene, 'warp_cross_01');
    }, 50);

    // commented the code below becouse it may be still needed
    // const pixelsInterval = 5;
    // const playerCenterY = Math.round(this.y + this.height / 2);
    // const portalCenterY = Math.round(portal.y + portal.height / 2);
    /* because collision event triggers with time
     interval we cant strictly compare two values
    so we are comparing player center position in small range around portal center */
    // const playerLowerRangePos = playerCenterY < portalCenterY + pixelsInterval;
    // const playerUpperRangePos = playerCenterY > portalCenterY - pixelsInterval;
    // if (playerLowerRangePos && playerUpperRangePos) {
    //   this.switchGravity();
    // }
  }

  switchGravity() {
    if (!this.disableGravitySwitch) {
      const minVelocity = this.jumpVelocity * 1;
      const currVelocity = Math.abs(this.body.velocity.y);
      /* adding additional velocity to players body so that player velocity wont fade out if he will
      be constantly jumping through portal
      */
      if (currVelocity < minVelocity) this.setVelocityY(this.flipY ? -minVelocity : minVelocity);
      this.disableGravitySwitch = true; // toggle flag
      this.body.gravityScale.y *= -1; // flip gravity
      this.setFlipY(!this.flipY); // flip character sprite
      /* because we are triggering switch gravity in interval(read comment in collision event
      description), this event can be triggered multiple times in a row. To avoid it we added
      flag that disables multiple gravitySwitch calls for 100ms */
      setTimeout(() => {
        this.disableGravitySwitch = false;
      }, 50);
    }
  }

  movePlayer() {
    const currentVelocity = this.body.velocity;
    const maxVelocity = 2;
    /* left/right move */
    if (this.controls.left.isDown) {
      this.moveCharacter('left');
      this.detachPositionOnHead(this.key);
    }
    if (this.controls.right.isDown) {
      this.detachPositionOnHead(this.key);
      this.moveCharacter('right');
    }
    if (!this.controls.left.isDown && !this.controls.right.isDown) {
      this.anims.stop();
      if (this.anims.currentAnim) this.anims.setCurrentFrame(this.anims.currentAnim.frames[0]);
    }
    /* limit velocity after applying force, so that the characters wont speed up infinitely */
    if (currentVelocity.x > maxVelocity) this.setVelocityX(maxVelocity);
    if (currentVelocity.x < -maxVelocity) this.setVelocityX(-maxVelocity);
    /* jump */
    if ((this.controls.up.isDown || this.controls.down.isDown) && this.isGrounded && this.canJump) {
      this.setVelocityY((this.isCarrying) ? -this.jumpVelocity * 2 : -this.jumpVelocity);
      this.canJump = false;
      this.scene.time.addEvent({
        delay: 800,
        // eslint-disable-next-line no-return-assign
        callback: () => (this.canJump = true),
      });
    }
  }

  moveCharacter(direction) {
    const moveForce = 0.015;
    const force = direction === 'right' ? moveForce : -moveForce;
    const shouldFlip = direction !== 'right';
    this.setFlipX(shouldFlip); // flipping character sprite
    if (this.canMove(direction)) this.applyForce({ x: force, y: 0 });
    this.anims.play(`move-${this.key}`, true); // playing move animation
  }

  canMove(direction) {
    const thisPlayer = (this.key === 'ibb') ? this.scene.ibb : this.scene.obb;
    const anotherPlayer = (this.key === 'ibb') ? this.scene.obb : this.scene.ibb;
    const charactersDistance = Math.abs(thisPlayer.x - anotherPlayer.x);
    if (direction === 'left' && thisPlayer.x <= anotherPlayer.x) return (charactersDistance < CHARACTERS_DISTANCE_MAX);
    if (direction === 'right' && thisPlayer.x >= anotherPlayer.x) return (charactersDistance < CHARACTERS_DISTANCE_MAX);
    return true;
  }
}
