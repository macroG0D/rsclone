import Phaser from 'phaser';

import {
  createMenu
} from '../../utils/createMenu';
import {
  createBg
} from '../../utils/createBg';

const titleStyle = {
  font: '45px Montserrat',
  fill: '#000000',
  align: 'center',
  fontStyle: 'strong',
};

export default class MainMenuJoinSession extends Phaser.Scene {
  constructor() {
    super('MainMenuJoinSession');
  }

  init(data) {
    this.rooms = data;
  }

  create() {
    const menuX = this.cameras.main.centerX;
    this.eng = this.game.localeEng;
    this.rooms = {
      '#room_1235': () => this.scene.start('Level1'),
      '#room_1525': () => this.scene.start('Level1'),
      '#room_1635': () => this.scene.start('Level1'),
      '#room_1825': () => this.scene.start('Level1'),
    };
    this.menuCallBack = () => this.scene.switch('MainMenuOnlineGame');
    createBg(this);
    this.choose = this.add.text(menuX, 148, 'choose session to join', titleStyle).setOrigin(0.5);
    createMenu(this, this.rooms, true, this.menuCallBack);
    this.checkLang();
  }

  updateLang() {
    if (this.game.localeEng) {
      this.choose.setText('choose session to join');
      this.menuItemBack.setText('back');
    } else {
      this.choose.setText('выбрать сессию');
      this.menuItemBack.setText('назад');
    }
  }

  checkLang() {
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
}
