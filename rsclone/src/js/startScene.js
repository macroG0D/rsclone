import Phaser from 'phaser';

export default class StartScene extends Phaser.Scene {
  constructor() {
    super('Start');
  }

  create() {
    this.add.sprite(0, 0, 'bg').setOrigin(0);
    this.createBg();
    this.addText();
    this.setEvents();
  }

  addText() {
    this.add.text(700, 700, 'click to start', {
      font: '40px',
      fill: '#ffffff',
    });
  }

  createBg() {
    this.add.sprite(0, 0, 'bg').setOrigin(0);
  }

  setEvents() {
    this.input.on('pointerdown', () => {
      this.scene.start('Level1');
    });
  }
}
