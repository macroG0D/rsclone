import Phaser from 'phaser';
import level1Env from '../assets/img/level1.svg';
import floor from '../assets/img/floor.svg'
import bubbles from '../assets/img/bubbles.png'


export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super('Preload');
  }

  preload() {
    this.load.image('level1Env', level1Env);
    this.load.image('floor', floor);
    this.load.image('bubbles', bubbles);
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
