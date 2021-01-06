import Phaser from 'phaser';
import ibbSprite from '../assets/ibb/ibb-sprite.png';
import obbSprite from '../assets/obb/obb-sprite.png';
import githubIcon from '../assets/images/github-logo-face.svg';
import obbImg from '../assets/images/obb.png';
import ibbImg from '../assets/images/ibb.png';
import obbKeys from '../assets/images/obbKeys.svg';
import ibbKeys from '../assets/images/ibbKeys.svg';

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super('Preload');
  }

  preload() {
    this.load.image('githubIcon', githubIcon);
    this.load.image('obbImg', obbImg);
    this.load.image('ibbImg', ibbImg);
    this.load.image('obbKeys', obbKeys);
    this.load.image('ibbKeys', ibbKeys);
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
    // this.scene.start('Level1');
  }

  createBg() {
    const ratio = this.game.config.width / 1920;
    this.add.sprite(0, 0, 'bg').setScale(ratio).setOrigin(0);
  }
}
