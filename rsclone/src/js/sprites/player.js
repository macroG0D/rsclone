import Phaser from 'phaser';
import { DEFAULT_MASS, DEFAULT_FRICTION, DEFAULT_FRICTION_AIR } from '../constants';

function createPlayerAnimations(scene, key, sprite) {
  scene.anims.create({
    key: `move-${key}`,
    frames: scene.game.anims.generateFrameNumbers(sprite),
    frameRate: 62,
    repeat: -1,
  });
}

export default class Player {
  constructor(scene, key, x, y, sprite, controls) {
    this.scene = scene;
    this.key = key;
    this.sprite = scene.matter.add.sprite(x, y, sprite);
    this.isGrounded = false;
    this.isCarrying = false;
    this.isHeadStanding = false;

    // Jumping is going to have a cooldown
    this.canJump = true;
    this.jumpCooldownTimer = null;

    const { Body, Bodies } = Phaser.Physics.Matter.Matter;
    const { width: w, height: h } = this.sprite;
    const mainBody = Bodies.rectangle(0, 0, w * 0.75, h, {
      chamfer: { radius: 1 },
    });

    this.sensors = {
      top: Bodies.rectangle(0, h - h * 1.5, w * 0.5, 5, { isSensor: true }),
      bottom: Bodies.rectangle(0, h * 0.5, w * 0.5, 5, { isSensor: true }),
      left: Bodies.rectangle(-w * 0.45, 0, 5, h * 0.4, { isSensor: true }),
      right: Bodies.rectangle(w * 0.45, 0, 5, h * 0.4, { isSensor: true }),
    };

    const compoundBody = Body.create({
      parts: [
        mainBody,
        this.sensors.top,
        this.sensors.bottom,
        this.sensors.left,
        this.sensors.right,
      ],
      frictionAir: DEFAULT_FRICTION_AIR,
      friction: DEFAULT_FRICTION,
      mass: DEFAULT_MASS,
    });
    this.sprite
      .setExistingBody(compoundBody)
      .setFixedRotation() // disable spin around its mass center point
      .setPosition(x, y);

    createPlayerAnimations(scene, key, sprite);

    this.controls = [];
    [this.controls.left, this.controls.right, this.controls.up] = controls;
    this.jumpVelocity = 9; // jump velocity moved to player class
    this.disableGravitySwitch = false; // additional flag

    const controlKeysSequence = ['left', 'right', 'up', 'down'];
    this.controls = {};
    controls.forEach((controlKey, controlIndex) => {
      const direction = controlKeysSequence[controlIndex];
      this.controls[direction] = this.scene
        .input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[controlKey]);
    });
    this.scene.events.on('update', this.update, this);

    // Track which sensors are touching something
    this.isTouching = {
      left: false, right: false, top: false, bottom: false,
    };

    // Before matter's update, reset our record of what surfaces the player is touching.
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
  }

  fixedPositionOnHead() {
    const currentCharacterKey = this.key;
    const secondCharacterKey = this.getSecondCharacterKey();
    if (this.scene[currentCharacterKey].isHeadStanding) {
      this.scene[currentCharacterKey].sprite.x = this.scene[secondCharacterKey].sprite.x;
    }
  }

  detachPositionOnHead(currentCharacterKey) {
    if (this.scene[currentCharacterKey].isHeadStanding) {
      this.scene[currentCharacterKey].isHeadStanding = false;
    }
  }

  getSecondCharacterKey() {
    return this.key === 'ibb' ? 'obb' : 'ibb';
  }

  // check if one player is standing on the second's head and update their statuses
  headStandingCheck() {
    const currentCharacterKey = this.key;
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
      objectA: this.scene[currentCharacterKey].sensors.bottom,
      objectB: this.scene[secondCharacterKey].sensors.top,
      callback: isOnHead,
      context: this,
    });
    this.scene.matterCollision.addOnCollideEnd({
      objectA: this.scene[currentCharacterKey].sensors.bottom,
      objectB: this.scene[secondCharacterKey].sensors.top,
      callback: isNotOnHead,
      context: this,
    });
  }

  // may be used when one player stands on the other's head insted of fixedPositionOnHead()
  // createConstraint(currentCharacterKey, secondCharacterKey) {
  //   const constraintOptions = {
  //     bodyA: this.scene[currentCharacterKey].sprite.body,
  //     bodyB: this.scene[secondCharacterKey].sprite.body,
  //     pointA: {
  //       x: this.scene[currentCharacterKey].sensors.bottom.position.x,
  //       y: this.scene[currentCharacterKey].sensors.bottom.position.y,
  //     },
  //     pointB: {
  //       x: this.scene[secondCharacterKey].sensors.top.position.x,
  //       y: this.scene[secondCharacterKey].sensors.top.position.y,
  //     },
  //     length: 50,
  //     stiffness: 0.4,
  //   };
  //   const constraints = this.scene.matter.constraint.create(constraintOptions);
  //   this.scene.matter.add.gameObject(constraints);
  // }

  onSensorCollide({ bodyA, bodyB }) { // may use pair as third argument
    if (bodyB.isSensor) return; // We only care about collisions with physical objects
    if (bodyA === this.sensors.left) {
      this.isTouching.left = true;
      // optional solution for wall friction
      // if (pair.separation > 0.5) this.sprite.x += pair.separation - 0.5;
    } else if (bodyA === this.sensors.right) {
      this.isTouching.right = true;
      // optional solution for wall friction
      // if (pair.separation > 0.5) this.sprite.x -= pair.separation - 0.5;
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
  }

  noWallsFriction() {
    if (!this.isTouching.bottom) {
      this.sprite.body.friction = 0;
    } else {
      this.sprite.body.friction = 0.02;
    }
  }

  update() {
    this.isGrounded = this.isTouching.bottom;
    this.headStandingCheck();
    this.noWallsFriction();
    this.fixedPositionOnHead();
    this.movePlayer(this.key);
  }

  switchGravity() {
    if (!this.disableGravitySwitch) {
      const minVelocity = this.jumpVelocity;
      const currVelocity = Math.abs(this.sprite.body.velocity.y);
      /* adding additional velocity to players body so that player velocity wont fade out if he will
      be constantly jumping through portal
      */
      if (currVelocity < minVelocity) {
        this.sprite.setVelocityY(this.sprite.flipY ? -minVelocity : minVelocity);
      }
      this.disableGravitySwitch = true; // toggle flag
      this.sprite.body.gravityScale.y *= -1; // flip gravity
      this.sprite.setFlipY(!this.flipY); // flip character sprite
      /* because we are triggering switch gravity in interval(read comment in collision event
      description), this event can be triggered multiple times in a row. To avoid it we added
      flag that disables multiple gravitySwitch calls for 100ms */
      setTimeout(() => {
        this.disableGravitySwitch = false;
      }, 100);
    }
  }

  movePlayer(characterKey) {
    const character = this.scene[this.key].sprite;
    const currentVelocity = character.body.velocity;
    const maxVelocity = 2;
    const moveForce = 0.015;
    const jumpVelocity = 14;
    /* left/right move */
    function moveCharacter(direction) {
      const force = direction === 'right' ? moveForce : -moveForce;
      const shouldFlip = direction !== 'right';
      character.setFlipX(shouldFlip); // flipping character sprite
      character.applyForce({ x: force, y: 0 }); // applying force to character
      character.anims.play(`move-${characterKey}`, true); // playing move animation
    }
    if (this.controls.left.isDown) {
      this.detachPositionOnHead(this.key);
      moveCharacter('left');
    } else if (this.controls.right.isDown) {
      this.detachPositionOnHead(this.key);
      moveCharacter('right');
    } else {
      character.anims.stop();
      if (character.anims.currentAnim) {
        character.anims.setCurrentFrame(character.anims.currentAnim.frames[0]);
      }
    }
    /* limit velocity after applying force, so that the characters wont speed up infinitely */
    if (currentVelocity.x > maxVelocity) {
      character.setVelocityX(maxVelocity);
    } else if (currentVelocity.x < -maxVelocity) {
      character.setVelocityX(-maxVelocity);
    }

    /* jump */
    if ((this.controls.up.isDown || this.controls.down.isDown) && this.isGrounded && this.canJump) {
      if (this.isCarrying) {
        character.setVelocityY(-jumpVelocity * 2);
      } else {
        character.setVelocityY(-jumpVelocity);
      }
      this.canJump = false;
      this.jumpCooldownTimer = this.scene.time.addEvent({
        delay: 800,
        // eslint-disable-next-line no-return-assign
        callback: () => (this.canJump = true),
      });
    }
  }
}
