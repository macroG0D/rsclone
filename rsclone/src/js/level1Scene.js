import Phaser from 'phaser';
import level1Env from '../assets/img/environment.svg';

export default class Level1Scene extends Phaser.Scene {
  constructor() {
    super('Level1');
  }

  preload() {
    this.load.image('level1Env', level1Env);
  }

  create() {
    this.createBg();
    console.log('запустили Level1');
  }

  createBg() {
    this.background = this.add.sprite(0, 0, 'level1Env').setOrigin(0);
  }
}
