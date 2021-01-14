import Phaser from 'phaser';

import {
  createBg,
} from '../../utils/createBg';

const selectedStyle = {
  font: '30px Montserrat',
  fill: '#D22D61',
  align: 'center',
  fontStyle: 'strong',
};

const titleStyle = {
  font: '45px Montserrat',
  fill: '#000000',
  align: 'center',
  fontStyle: 'strong',
};

const menuItemBackStyle = {
  font: '20px Montserrat',
  fill: '#979797',
  align: 'center',
  fontStyle: 'strong',
};

const menuItemOverStyle = {
  fill: '#D22D61',
};

export default class MainMenuSettings extends Phaser.Scene {
  constructor() {
    super('MainMenuNewSession');
  }

  create() {
    this.eng = this.game.localeEng;
    // число просто для примера
    this.roomNumber = 1354;
    createBg(this);
    this.createItems();
    if (!this.game.localeEng) {
      this.updateLang();
    }
    this.events.on('wake', () => {
      if (this.eng !== this.game.localeEng) {
        this.updateLang();
        this.eng = this.game.localeEng;
      }
    });
  }

  createItems() {
    const menuX = this.cameras.main.centerX;
    this.room = this.add.text(menuX, 95, `#room_${this.roomNumber}`, selectedStyle).setOrigin(0.5);
    this.waiting = this.add.text(menuX, 360, 'waiting for second player', titleStyle).setOrigin(0.5);
    this.cancel = this.add.text(menuX, 609, 'cancel', menuItemBackStyle)
      .setOrigin(0.5)
      .setInteractive({
        useHandCursor: true,
      })
      .on('pointerover', () => this.cancel.setStyle(menuItemOverStyle))
      .on('pointerout', () => this.cancel.setStyle(menuItemBackStyle))
      .on('pointerdown', () => this.scene.switch('MainMenuOnlineGame'));
  }

  updateLang() {
    if (this.game.localeEng) {
      this.waiting.setText('waiting for second player');
      this.cancel.setText('cancel');
    } else {
      this.waiting.setText('ожидание второго игрока');
      this.cancel.setText('отмена');
    }
  }
}
