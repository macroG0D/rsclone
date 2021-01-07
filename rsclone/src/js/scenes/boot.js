import Phaser from 'phaser';
import bootBg from '../../assets/images/boot.jpg';

export default class Boot extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload() {
    this.load.image('bootBg', bootBg);
  }

  create() {
    this.scene.start('Preload');
  }
}
