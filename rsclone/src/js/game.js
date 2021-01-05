import Phaser from 'phaser';
import logoImg from '../assets/images/logo.png';
import flagImg from '../assets/images/pirate_flag.png';

export default class MyGame extends Phaser.Scene {
  preload() {
    this.load.image('logo', logoImg);
    this.load.image('flag', flagImg);
  }

  create() {
    const logo = this.add.image(400, 150, 'logo');
    const flag = this.add.image(400, 150, 'flag');

    this.tweens.add({
      targets: logo,
      y: 450,
      duration: 2000,
      ease: 'Power2',
      yoyo: true,
      loop: -1,
    });

    this.tweens.add({
      targets: flag,
      x: 450,
      duration: 2000,
      ease: 'Power2',
      yoyo: true,
      loop: -1,
    });
  }
}
