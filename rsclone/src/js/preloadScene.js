import Phaser from 'phaser';
import level1Bg from '../assets/img/level1Bg.svg';
import level1 from '../assets/img/level1.png';
import level1Env from '../assets/img/environment.svg';


export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super('Preload');
  }

  preload() {
    // this.load.image('level1Bg', level1Bg);
    // this.load.image('level1', level1);
    // this.load.image('level1Env', level1Env);
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
