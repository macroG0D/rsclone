import Phaser from 'phaser';

import {
  DEFAULT_MASS,
  DEFAULT_FRICTION,
  DEFAULT_FRICTION_AIR,
  CHARACTERS_DISTANCE_MAX,
} from '../constants';

import { playSound } from '../utils/playSound';

function createPlayerAnimations(scene, key, sprite) {
  scene.anims.create({
    key: `move-${key}`,
    frames: scene.game.anims.generateFrameNumbers(sprite),
    frameRate: 60,
    repeat: -1,
  });
}
export default class Player extends Phaser.Physics.Matter.Sprite {
  constructor(scene, key, x, y, sprite) {
    super(scene.matter.world, x, y, sprite);
    createPlayerAnimations(scene, key, sprite);
    this.directions = {
      up: false,
      down: false,
      left: false,
      right: false,
    };
    this.portals = this.scene.portals;
    this.isAlive = true;
    this.scene = scene;
    this.key = key;
    this.isGrounded = false;
    this.isCarrying = false;
    this.isHeadStanding = false;
    this.isRotated = false;
    this.canJump = true;
    const { Body, Bodies } = Phaser.Physics.Matter.Matter;
    const { width: w, height: h } = this;
    const mainBody = Bodies.rectangle(0, 0, w * 0.75, h, { chamfer: { radius: 8 } });
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

    this.jumpVelocity = 14; // jump velocity moved to player class
    this.disableGravitySwitch = false; // additional flag
    this.scene.add.existing(this);
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
    this.body.restitution = 0.3;
    this.setCollisionCategory(2);
  }

  getAnotherPlayer() {
    const anotherPlayerKey = this.key === 'ibb' ? 'obb' : 'ibb';
    return this.scene[anotherPlayerKey];
  }

  isOnHead() {
    this.isHeadStanding = true;
    this.getAnotherPlayer().isCarrying = true;
  }

  isNotOnHead() {
    this.isHeadStanding = false;
    this.getAnotherPlayer().isCarrying = false;
  }

  // check if one player is standing on the second's head and update their statuses
  headStandingCheck() {
    this.scene.matterCollision.addOnCollideStart({
      objectA: this.sensors.bottom,
      objectB: this.getAnotherPlayer().sensors.top,
      callback: this.isOnHead,
      context: this,
    });
    this.scene.matterCollision.addOnCollideEnd({
      objectA: this.sensors.bottom,
      objectB: this.getAnotherPlayer().sensors.top,
      callback: this.isNotOnHead,
      context: this,
    });
  }

  onSensorCollide({ bodyA, bodyB, pair }) { // may use pair as third argument
    if (bodyB.isSensor) return; // We only care about collisions with physical objects
    if (bodyA === this.sensors.left) {
      this.isTouching.left = true;
      if (pair.separation > 3) this.x += (this.isRotated) ? -3 : 3;
    }
    if (bodyA === this.sensors.right) {
      this.isTouching.right = true;
      if (pair.separation > 3) this.x += (this.isRotated) ? 3 : -3;
    }
    if (bodyA === this.sensors.top) this.isTouching.top = true;
    if (bodyA === this.sensors.bottom) this.isTouching.bottom = true;
  }

  resetTouching() {
    this.isTouching.left = false;
    this.isTouching.right = false;
    this.isTouching.top = false;
    this.isTouching.bottom = false;
    this.isTouching.center = false;
  }

  portalsListeners(scene, portal) {
    scene.matterCollision.addOnCollideStart({
      objectA: [this.sensors.center],
      objectB: portal,
      callback: () => this.portalDive(portal),
      context: this,
    });
  }

  portalDive(portal) {
    portal.emitParticles(this.x, this.width, this.body.velocity.y, this.isRotated);
    this.scene.time.addEvent({
      delay: 50,
      callback: () => {
        playSound(this.scene, 'warp_cross');
        this.switchGravity();
      },
    });
  }

  rotatePlayer() {
    this.angle = (this.isRotated) ? 0 : 180;
    this.isRotated = !this.isRotated;
    this.turnCharacter();
  }

  turnCharacter() {
    const checkDirection = (this.isRotated) ? 'right' : 'left';
    this.setFlipX(this.direction === checkDirection);
  }

  switchGravity() {
    if (!this.disableGravitySwitch) {
      const minVelocity = this.jumpVelocity;
      const currVelocity = Math.abs(this.body.velocity.y);
      /* adding additional velocity to players body so that player velocity wont fade out if he will
      be constantly jumping through portal
      */
      if (currVelocity < minVelocity) {
        this.setVelocityY(this.isRotated ? -minVelocity : minVelocity);
      }
      this.body.gravityScale.y *= -1; // flip gravity
      this.rotatePlayer(); // rotate character
      this.disableGravitySwitch = true; // toggle flag
      /* because we are triggering switch gravity in interval(read comment in collision event
      description), this event can be triggered multiple times in a row. To avoid it we added
      flag that disables multiple gravitySwitch calls for 100ms */
      this.scene.time.addEvent({
        delay: 30,
        callback: () => { this.disableGravitySwitch = false; },
      });
    }
  }

  movePlayer() {
    if (!this.isAlive) return;
    const currentVelocity = this.body.velocity;
    const maxVelocity = 2;
    /* left/right move */
    if (this.directions.left) this.moveCharacter('left');
    if (this.directions.right) this.moveCharacter('right');

    if (!this.directions.left && !this.directions.right) {
      this.anims.stop();
      if (this.anims.currentAnim) this.anims.setCurrentFrame(this.anims.currentAnim.frames[0]);
    }

    /* limit velocity after applying force, so that the characters wont speed up infinitely */
    if (currentVelocity.x > maxVelocity) this.setVelocityX(maxVelocity);
    if (currentVelocity.x < -maxVelocity) this.setVelocityX(-maxVelocity);

    /* jump */
    if ((this.directions.up || this.directions.down) && this.isGrounded && this.canJump) {
      this.setVelocityY((this.isRotated) ? this.jumpVelocity : -this.jumpVelocity);
      if (this.isCarrying) {
        Phaser.Physics.Matter.Matter.Body.setVelocity(this.getAnotherPlayer().body, {
          x: this.body.velocity.x,
          y: this.body.velocity.y,
        });
      }
      this.canJump = false;
      playSound(this.scene, 'popbase');
      this.scene.time.addEvent({
        delay: 700,
        callback: () => { this.canJump = true; },
      });
    }
  }

  moveCharacter(direction) {
    const moveForce = 0.015;
    const force = (direction === 'right') ? moveForce : -moveForce;
    if (this.canMove(direction)) {
      this.applyForce({ x: force, y: 0 });
      if (this.isGrounded) playSound(this.scene, `xbb_run_${direction}`);
    }
    if (this.isCarrying) this.getAnotherPlayer().applyForce({ x: force, y: 0 });
    this.direction = direction;
    this.turnCharacter();
    this.anims.play(`move-${this.key}`, true); // playing move animation
  }

  canMove(direction) {
    const anotherPlayer = this.getAnotherPlayer();
    const charactersDistance = Math.abs(this.x - anotherPlayer.x);
    if (direction === 'left' && this.x <= anotherPlayer.x) return (charactersDistance < CHARACTERS_DISTANCE_MAX);
    if (direction === 'right' && this.x >= anotherPlayer.x) return (charactersDistance < CHARACTERS_DISTANCE_MAX);
    return true;
  }

  update() {
    if (this.scene && this.isAlive) {
      this.isGrounded = this.isTouching.bottom;
      this.headStandingCheck();
      this.movePlayer();
    }
  }
}
