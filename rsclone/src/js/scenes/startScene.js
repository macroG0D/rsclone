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
    this.music = this.sound.add('main_menu_music');
    this.music.play({ loop: true });
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
      this.music.destroy();
      this.scene.start('Level1');
    });
  }
}
