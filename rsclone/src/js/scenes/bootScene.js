import Phaser from 'phaser';
import bootBg from '../../assets/images/boot.jpg';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload() {
    this.load.image('bg', bootBg);
  }

  create() {
    this.scene.start('Preload');
  }
}
