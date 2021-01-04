import Phaser from 'phaser';

export default class Level1Scene extends Phaser.Scene {
  constructor() {
    super('Level1');
  }

  create() {
    this.createBg();
    this.createGround();
  }

  createBg() {
    this.background = this.add.sprite(0, 0, 'level1Env').setOrigin(0).setScale(0.4);
  }

  createGround(){
    this.ground = this.physics.add.staticGroup();
    this.ground.create(0,345,'floor').setScale(1,0.3).setOrigin(0).refreshBody();
    this.ground.create(450,345,'floor').setScale(1.3,0.3).setOrigin(0).refreshBody();
    this.ground.create(870,345,'floor').setScale(0.3).setOrigin(0).setAngle(90).refreshBody();
    this.ground.create(870,434,'floor').setScale(1,0.3).setOrigin(0).refreshBody();
  }
}
