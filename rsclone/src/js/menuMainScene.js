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
      font: '30px Montserrat',
      fill: '#000000',
      align: 'center',
      fontStyle: 'strong',
      fixedWidth: 200,
    };

    const styleOver = {
      fill: '#D22D61',
    };

    const menu1 = this.add.text(this.cameras.main.centerX - 100, this.game.config.height / 2 - 100, 'play', style)
      .setInteractive()
      .on('pointerover', () => {
        menu1.setStyle(styleOver);
      })
      .on('pointerout', () => {
        menu1.setStyle(style);
      })
      .on('pointerdown', () => {
        this.scene.start('menuPlay');
      });

    const menu2 = this.add.text(this.cameras.main.centerX - 100, this.game.config.height / 2 - 50, 'leaderboard', style)
      .setInteractive()
      .on('pointerover', () => {
        menu2.setStyle(styleOver);
      })
      .on('pointerout', () => {
        menu2.setStyle(style);
      })
      .on('pointerdown', () => {
        this.scene.start('leader');
      });

    const menu3 = this.add.text(this.cameras.main.centerX - 100, this.game.config.height / 2, 'settings', style)
      .setInteractive()
      .on('pointerover', () => {
        menu3.setStyle(styleOver);
      })
      .on('pointerout', () => {
        menu3.setStyle(style);
      })
      .on('pointerdown', () => {
        this.scene.start('settings');
      });

    const menu4 = this.add.text(this.cameras.main.centerX - 100, this.game.config.height / 2 + 50, 'developers', style)
      .setInteractive()
      .on('pointerover', () => {
        menu4.setStyle(styleOver);
      })
      .on('pointerout', () => {
        menu4.setStyle(style);
      })
      .on('pointerdown', () => {
        this.scene.start('developers');
      });

    const menu5 = this.add.text(this.cameras.main.centerX - 100, this.game.config.height / 2 + 100, 'about', style)
      .setInteractive()
      .on('pointerover', () => {
        menu5.setStyle(styleOver);
      })
      .on('pointerout', () => {
        menu5.setStyle(style);
      })
      .on('pointerdown', () => {
        window.open('https://github.com/macroG0D/rsclone');
      });
  }

  createBg() {
    this.background = this.add.graphics();
    this.background.fillStyle(0xE5E5E5, 1.0);
    this.background.fillRect(0, 0, this.game.config.width, this.game.config.height);
  }
}
