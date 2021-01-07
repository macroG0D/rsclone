import Phaser from 'phaser';

export default class StartScene extends Phaser.Scene {
  constructor() {
    super('Start');
  }

  create() {
    this.createBg();
    this.addText();
    this.setEvents();
  }

  addText() {
    this.add.text(this.game.config.width / 2 - 150, this.game.config.height / 2, 'click to start', {
      font: '40px',
      fill: '#ffffff',
    });
  }

  createBg() {
    const ratio = this.game.config.width / 1920;
    this.add.sprite(0, 0, 'bg').setScale(ratio).setOrigin(0);
  }

  setEvents() {
    this.input.on('pointerdown', () => {
      this.scene.start('Level1');
    });
  }
}
