import Phaser from 'phaser';

export default class DevelopersScene extends Phaser.Scene {
  constructor() {
    super('developers');
  }

  create() {
    this.createBg();
    this.createMenu();
  }

  createMenu() {
    const styleTitle = {
      font: '32px Montserrat',
      fill: '#000000',
      align: 'center',
      fontStyle: 'strong',
      fixedWidth: 200,
    };

    const style = {
      font: '30px Montserrat',
      fill: '#000000',
      // align: 'center',
      fontStyle: 'strong',
      fixedWidth: 200,
    };

    const styleOver = {
      fill: '#D22D61',
    };

    const styleBack = {
      font: '20px Montserrat',
      fill: '#979797',
      align: 'center',
      fontStyle: 'strong',
      fixedWidth: 200,
    };

    this.add.text(this.cameras.main.centerX - 110, this.game.config.height / 2 - 120, 'developers', styleTitle);

    this.add.image(this.cameras.main.centerX - 85, this.game.config.height / 2 - 32, 'githubIcon');
    this.add.image(this.cameras.main.centerX - 85, this.game.config.height / 2 + 18, 'githubIcon');
    this.add.image(this.cameras.main.centerX - 85, this.game.config.height / 2 + 68, 'githubIcon');
    this.add.image(this.cameras.main.centerX - 85, this.game.config.height / 2 + 118, 'githubIcon');

    const macroG0D = this.add.text(this.cameras.main.centerX - 65, this.game.config.height / 2 - 50, 'macroG0D', style)
      .setInteractive()
      .on('pointerover', () => {
        macroG0D.setStyle(styleOver);
      })
      .on('pointerout', () => {
        macroG0D.setStyle(style);
      })
      .on('pointerdown', () => {
        window.open('https://github.com/macroG0D');
      });

    const i3Code = this.add.text(this.cameras.main.centerX - 65, this.game.config.height / 2, 'i3-code', style)
      .setInteractive()
      .on('pointerover', () => {
        i3Code.setStyle(styleOver);
      })
      .on('pointerout', () => {
        i3Code.setStyle(style);
      })
      .on('pointerdown', () => {
        window.open('https://github.com/i3-code');
      });

    const heliken = this.add.text(this.cameras.main.centerX - 65, this.game.config.height / 2 + 50, 'heliken', style)
      .setInteractive()
      .on('pointerover', () => {
        heliken.setStyle(styleOver);
      })
      .on('pointerout', () => {
        heliken.setStyle(style);
      })
      .on('pointerdown', () => {
        window.open('https://github.com/Heliken');
      });

    const mauta = this.add.text(this.cameras.main.centerX - 65, this.game.config.height / 2 + 100, 'mauta', style)
      .setInteractive()
      .on('pointerover', () => {
        mauta.setStyle(styleOver);
      })
      .on('pointerout', () => {
        mauta.setStyle(style);
      })
      .on('pointerdown', () => {
        window.open('https://github.com/mauta');
      });

    const back = this.add.text(this.cameras.main.centerX - 120, this.game.config.height / 2 + 250, 'back', styleBack)
      .setInteractive()
      .on('pointerover', () => {
        back.setStyle(styleOver);
      })
      .on('pointerout', () => {
        back.setStyle(styleBack);
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
