import Phaser from 'phaser';
import ibbSprite from '../assets/ibb/ibb-sprite.png';
import obbSprite from '../assets/obb/obb-sprite.png';

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super('Preload');
  }

  preload() {
    this.load.spritesheet('ibb-sprite', ibbSprite, { frameWidth: 47, frameHeight: 53 });
    this.load.spritesheet('obb-sprite', obbSprite, { frameWidth: 47, frameHeight: 64 });
  }

  create() {
    // this.createBg();
    // this.addIntro();
    this.scene.start('Start');
  }

  // createBg() {
  //   this.add.sprite(0, 0, 'bg').setOrigin(0);
  // }

  // addIntro() {
  //   this.add.text(500, 500, 'this game developed by:', {
  //     font: '40px',
  //     fill: '#ffffff',
  //   });
  //   this.add.text(500, 550, 'macroG0D', {
  //     font: '40px',
  //     fill: '#ffffff',
  //   });
  //   this.add.text(500, 600, 'i3-code', {
  //     font: '40px',
  //     fill: '#ffffff',
  //   });
  //   this.add.text(500, 650, 'heliken', {
  //     font: '40px',
  //     fill: '#ffffff',
  //   });
  //   this.add.text(500, 700, 'mauta', {
  //     font: '40px',
  //     fill: '#ffffff',
  //   });
  // }
}
