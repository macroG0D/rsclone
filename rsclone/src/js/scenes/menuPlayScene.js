import Phaser from 'phaser';

export default class MenuPLayScene extends Phaser.Scene {
  constructor() {
    super('menuPlay');
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
      fixedWidth: 220,
    };

    const styleOver = {
      fill: '#D22D61',
    };

    const styleBack = {
      font: '20px Montserrat',
      fill: '#979797',
      align: 'center',
      fontStyle: 'strong',
      fixedWidth: 220,
    };

    const menu1 = this.add.text(this.cameras.main.centerX - 110, this.game.config.height / 2 - 25, 'local game', style)
      .setInteractive()
      .on('pointerover', () => {
        menu1.setStyle(styleOver);
      })
      .on('pointerout', () => {
        menu1.setStyle(style);
      })
      .on('pointerdown', () => {
        this.scene.start('localGame');
      });

    const menu2 = this.add.text(this.cameras.main.centerX - 110, this.game.config.height / 2 + 25, 'invite a friend', style)
      .setInteractive()
      .on('pointerover', () => {
        menu2.setStyle(styleOver);
      })
      .on('pointerout', () => {
        menu2.setStyle(style);
      })
      .on('pointerdown', () => {
        this.scene.start('onlineGame');
      });

    const menu3 = this.add.text(this.cameras.main.centerX - 110, this.game.config.height / 2 + 250, 'back', styleBack)
      .setInteractive()
      .on('pointerover', () => {
        menu3.setStyle(styleOver);
      })
      .on('pointerout', () => {
        menu3.setStyle(styleBack);
      })
      .on('pointerdown', () => {
        this.scene.start('menuMain');
      });
  }

  createBg() {
    this.background = this.add.graphics();
    this.background.fillStyle(0xE5E5E5, 1.0);
    this.background.fillRect(0, 0, this.game.config.width, this.game.config.height);
  }
}
