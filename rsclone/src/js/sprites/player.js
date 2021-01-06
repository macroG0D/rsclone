import Phaser from 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, key, x, y, sprite) {
    super(scene, x, y, sprite);
    scene.physics.world.enable(this);
    scene.add.existing(this);
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
