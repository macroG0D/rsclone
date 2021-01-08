import Phaser from 'phaser';

function createPlayerAnimations(scene, key, sprite) {
  scene.anims.create({
    key: `move-${key}`,
    frames: scene.game.anims.generateFrameNumbers(sprite),
    frameRate: 31,
    repeat: -1,
  });
}

export default class Player extends Phaser.Physics.Matter.Sprite {
  constructor(scene, key, x, y, sprite, controls) {
    const DEFAULT_MASS = 1; // number is random right now, can(should?) be changed later
    super(scene.matter.world, x, y, sprite);
    this.scene = scene;
    this.key = key;
    this.sprite = sprite;
    this.controls = [];
    [this.controls.left, this.controls.right, this.controls.up] = controls;
    createPlayerAnimations(this.scene, this.key, this.sprite);
    this.setFixedRotation(); // disable spin around its mass center point
    this.setMass(DEFAULT_MASS);
    this.jumpVelocity = 9; // jump velocity moved to player class
    this.disableGravitySwitch = false; // additional flag
    this.scene.add.existing(this);

    const controlKeysSequence = ['left', 'right', 'up', 'down'];
    this.controls = {};
    controls.forEach((controlKey, controlIndex) => {
      const direction = controlKeysSequence[controlIndex];
      this.controls[direction] = this.scene
        .input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[controlKey]);
    });
    this.scene.events.on('update', this.update, this);
  }

  switchGravity() {
    if (!this.disableGravitySwitch) {
      const minVelocity = this.jumpVelocity;
      const currVelocity = Math.abs(this.body.velocity.y);
      /* adding additional velocity to players body so that player velocity wont fade out if he will
      be constantly jumping through portal
      */
      if (currVelocity < minVelocity) {
        this.setVelocityY(this.flipY ? -minVelocity : minVelocity);
      }
      this.disableGravitySwitch = true; // toggle flag
      this.body.gravityScale.y *= -1; // flip gravity
      this.setFlipY(!this.flipY); // flip character sprite
      /* because we are triggering switch gravity in interval(read comment in collision event
      description), this event can be triggered multiple times in a row. To avoid it we added
      flag that disables multiple gravitySwitch calls for 100ms */
      setTimeout(() => {
        this.disableGravitySwitch = false;
      }, 100);
    }
  }

  update() {
    this.movePlayer(this.key);
  }

  movePlayer(characterKey) {
    const character = this.scene[this.key];
    const currentVelocity = character.body.velocity;
    const maxVelocity = 2;
    const moveForce = 0.01;
    const { isOnGround } = character;
    const jumpVelocity = 9;
    /* left/right move */
    function moveCharacter(direction) {
      const force = direction === 'right' ? moveForce : -moveForce;
      const shouldFlip = direction !== 'right';
      character.setFlipX(shouldFlip); // flipping character sprite
      character.applyForce({ x: force, y: 0 }); // applying force to character
      character.anims.play(`move-${characterKey}`, true); // playing move animation
    }
    if (this.controls.left.isDown) {
      moveCharacter('left');
    } else if (this.controls.right.isDown) {
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
    if ((this.controls.up.isDown || this.controls.down.isDown) && isOnGround) {
      character.isOnGround = false;
      character.setVelocityY(-jumpVelocity);
    }
  }
}
