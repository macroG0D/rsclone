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
    // these and other options should be configured for proper physic behaviour, commented for now
    const options = {
      // frictionStatic: 0.1,
      // frictionAir: 0.0,
      // friction: 0.1,
    };
    super(scene.matter.world, x, y, sprite);
    this.setFixedRotation(); // disable spin around its mass center point
    this.setMass(DEFAULT_MASS);
    scene.add.existing(this);
    createPlayerAnimations(scene, key, sprite);
  }
}
