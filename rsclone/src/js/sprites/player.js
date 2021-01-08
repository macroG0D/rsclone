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
  constructor(scene, key, x, y, sprite) {
    const DEFAULT_MASS = 1; // number is random right now, can(should?) be changed later

    /*
    // these and other options should be configured for proper physic behaviour, commented for now
    const options = {
      frictionStatic: 0.1,
      frictionAir: 0.0,
      friction: 0.1,
    };
    */

    super(scene.matter.world, x, y, sprite);
    this.setFixedRotation(); // disable spin around its mass center point
    this.setMass(DEFAULT_MASS);
    scene.add.existing(this);
    createPlayerAnimations(scene, key, sprite);
    this.jumpVelocity = 9; // jump velocity moved to player class
    this.disableGravitySwitch = false; // additional flag
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
}
