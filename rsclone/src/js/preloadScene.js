import Phaser from 'phaser';
import ibbSprite from '../assets/ibb/ibb-sprite.png';
import obbSprite from '../assets/obb/obb-sprite.png';

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super('Preload');
  }

  preload() {
    console.log('PreloadScene.preload');
    this.createBg();
    this.load.spritesheet('ibb-sprite', ibbSprite, {
      frameWidth: 47,
      frameHeight: 53,
    });
    this.load.spritesheet('obb-sprite', obbSprite, {
      frameWidth: 47,
      frameHeight: 64,
    });
  }

  create() {
    this.scene.start('menuMain');
  }

  createBg() {
    const ratio = this.game.config.width / 1920;
    this.add.sprite(0, 0, 'bg').setScale(ratio).setOrigin(0);
  }
}
