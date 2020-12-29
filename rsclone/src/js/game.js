import Phaser from 'phaser';

export default class MyGame extends Phaser.Scene {
  preload() {
    this.load.crossOrigin = 'anonymous';
    this.load.image('logo', '../assets/images/logo.png');
  }

  create() {
    const logo = this.add.image(400, 150, 'logo');

    this.tweens.add({
      targets: logo,
      y: 450,
      duration: 2000,
      ease: 'Power2',
      yoyo: true,
      loop: -1,
    });
  }
}
