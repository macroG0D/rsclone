import Phaser from 'phaser';

export default class Player extends Phaser.Physics.Matter.Sprite {
  constructor(scene, key, x, y, sprite) {
    super(scene, x, y, sprite);
    const DEFAULT_MASS = 1; // number is random right now, can(should?) be changed later
    // these and other options should be configured for proper physic behaviour, commented for now
    const options = {
      // frictionStatic: 0.1,
      // frictionAir: 0.0,
      // friction: 0.1,
    };
    //this.setFixedRotation(); // disable spin around its mass center point
    /* setting equal mass to different size sprites, so
    that characters will jump same height and run with the same speed */
    //this.setMass(DEFAULT_MASS);
    //scene.matter.add.sprite(this, null, options);
    //scene.physics.world.enable(this);
    //scene.add.existing(this);
    this.createPlayerAnimations(scene, key, sprite);
  }

  createPlayerAnimations(scene, key, sprite) {
    this.setCollideWorldBounds(true);
    scene.anims.create({
      key: `move-${key}`,
      frames: scene.game.anims.generateFrameNumbers(sprite),
      frameRate: 31,
      repeat: -1,
    });
  }
}
