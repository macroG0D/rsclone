import Phaser from 'phaser';

export default class LocalGameScene extends Phaser.Scene {
  constructor() {
    super('localGame');
  }

  create() {
    this.createBg();
    this.createMenu();
    this.createImg();
  }

  createImg() {
    this.add.image(314, 215, 'ibbImg');
    this.add.image(967, 215, 'obbImg');
    this.add.image(314, 437, 'ibbKeys');
    this.add.image(967, 437, 'obbKeys');
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

    const menu1 = this.add.text(this.cameras.main.centerX - 110, 442, 'start game', style)
      .setInteractive()
      .on('pointerover', () => {
        menu1.setStyle(styleOver);
      })
      .on('pointerout', () => {
        menu1.setStyle(style);
      })
      .on('pointerdown', () => {
        this.scene.start('Level1');
      });

    const back = this.add.text(this.cameras.main.centerX - 110, this.game.config.height / 2 + 250, 'back', styleBack)
      .setInteractive()
      .on('pointerover', () => {
        back.setStyle(styleOver);
      })
      .on('pointerout', () => {
        back.setStyle(styleBack);
      })
      .on('pointerdown', () => {
        this.scene.start('menuPlay');
      });
  }

  createBg() {
    this.background = this.add.graphics();
    this.background.fillStyle(0xE5E5E5, 1.0);
    this.background.fillRect(0, 0, this.game.config.width, this.game.config.height);
  }
}
