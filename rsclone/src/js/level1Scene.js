import Phaser from 'phaser';

export default class Level1Scene extends Phaser.Scene {
  constructor() {
    super('Level1');
  }


  create() {
    this.createBg();
    console.log('запустили Level1');
  }

  createBg() {
    this.add.sprite(0, 0, 'level1Env').setOrigin(0);
  }
}
