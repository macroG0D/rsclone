import Phaser from 'phaser';
import startBg from '../assets/img/start.jpg';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload() {
    this.load.image('bg', startBg);
  }

  create() {
    this.scene.start('Preload');
  }
}
