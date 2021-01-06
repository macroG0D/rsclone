import Phaser from 'phaser';
import startBg from '../../assets/img/start.jpg';
import mainMenuMusic from '../../assets/music/main_menu.mp3';
import level1Music from '../../assets/music/level1.mp3';
import level2Music from '../../assets/music/level2.mp3';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload() {
    this.load.image('bg', startBg);
  }

  create() {
    this.createBg();
    this.addIntro();
    this.scene.start('Preload');
  }

  createBg() {
    this.add.sprite(0, 0, 'bg').setOrigin(0);
  }

  addIntro() {
    this.add.text(500, 500, 'this game developed by:', {
      font: '40px',
      fill: '#ffffff',
    });
    this.add.text(500, 550, 'macroG0D', {
      font: '40px',
      fill: '#ffffff',
    });
    this.add.text(500, 600, 'i3-code', {
      font: '40px',
      fill: '#ffffff',
    });
    this.add.text(500, 650, 'heliken', {
      font: '40px',
      fill: '#ffffff',
    });
    this.add.text(500, 700, 'mauta', {
      font: '40px',
      fill: '#ffffff',
    });
  }
}
