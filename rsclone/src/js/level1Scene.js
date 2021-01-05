import Phaser from 'phaser';

export default class Level1Scene extends Phaser.Scene {
  constructor() {
    super('Level1');
  }

  create() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.createBg();
    this.createGround();
    this.createObb();
    this.physics.world.setBounds(0, 0, this.background.width * 0.5, this.game.config.height);
    this.cameras.main.setBounds(0, 0, this.background.width * 0.5, this.game.config.height);
    this.cameras.main.startFollow(this.obb);
  }

  createBg() {
    this.background = this.add.sprite(0, this.game.config.height / 2, 'level1Env').setOrigin(0, 0.5).setScale(0.6);
  }

  createGround() {
    this.ground = this.physics.add.staticGroup();
    this.ground.create(0, 336, 'floor').setScale(1.5, 1).setOrigin(0).refreshBody();
    this.ground.create(400, 336, 'floor').setScale(1.4, 1).setOrigin(0).refreshBody();
    this.ground.create(624, 336, 'floor').setScale(0.8, 1).setOrigin(0).setAngle(90)
      .refreshBody();
    this.ground.create(608, 464, 'floor').setScale(1.5, 1).setOrigin(0).refreshBody();
    this.ground.create(848, 464, 'floor').setScale(0.8, 1).setOrigin(0).setAngle(90)
    .refreshBody();
    this.ground.create(848, 576, 'floor').setScale(2, 1).setOrigin(0).refreshBody();
    this.ground.create(1350, 576, 'floor').setScale(3, 1).setOrigin(0).refreshBody();
    this.ground.create(2000, 576, 'floor').setScale(2.5, 1).setOrigin(0).refreshBody();
    this.ground.create(2400, 520, 'floor').setScale(0.4, 1).setOrigin(0).setAngle(90)
    .refreshBody();
    this.ground.create(2400, 520, 'floor').setScale(2, 1).setOrigin(0).refreshBody();
  }

  createObb() {
    this.obb = this.physics.add.sprite(100, 250, 'obb').setScale(0.5).refreshBody();
    this.obb.setBounce(0.3);
    this.obb.setCollideWorldBounds(true);
    this.obb.body.setGravityY(2000);

    this.physics.add.collider(this.obb, this.ground);
  }

  update() {
    this.obb.body.setVelocity(0);

    if (this.cursors.left.isDown) {
      this.obb.body.setVelocityX(-100);
    }
    if (this.cursors.right.isDown) {
      this.obb.body.setVelocityX(100);
    }
  }
}
