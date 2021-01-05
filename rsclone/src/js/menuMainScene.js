import Phaser from 'phaser';

export default class MenuMainScene extends Phaser.Scene {
  constructor() {
    super('menuMain');
  }

  create() {
    this.createBg();
    this.createMenu();
  }

  createMenu() {
    const style = {
      font: '30px bold',
      fill: '#000000',
      align: 'center',
      fixedWidth: 200,
    };

    this.menu1 = this.add.text(this.cameras.main.centerX - 100, this.game.config.height / 2 - 100, 'play', style);
    this.add.text(this.cameras.main.centerX - 100, this.game.config.height / 2 - 50, 'leaderboard', style);
    this.add.text(this.cameras.main.centerX - 100, this.game.config.height / 2, 'settings', style);
    this.add.text(this.cameras.main.centerX - 100, this.game.config.height / 2 + 50, 'developers', style);
    this.add.text(this.cameras.main.centerX - 100, this.game.config.height / 2 + 100, 'about', style);
  }

  createBg() {
    this.background = this.add.graphics();
    this.background.fillStyle(0xE5E5E5, 1.0);
    this.background.fillRect(0, 0, this.game.config.width, this.game.config.height);
  }
}
