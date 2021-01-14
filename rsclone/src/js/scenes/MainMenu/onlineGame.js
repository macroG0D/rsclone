import Phaser from 'phaser';

import {
  createMenu
} from '../../utils/createMenu';
import {
  createBg
} from '../../utils/createBg';

export default class MainMenuOnlineGame extends Phaser.Scene {
  constructor() {
    super('MainMenuOnlineGame');
  }

  create() {
    this.eng = this.game.localeEng;
    this.menuItems = {
      // в сцену можно передать данные для конкретных игр
      //  newSession: () => this.scene.start(''MainMenuNewSession', data),
      newSession: () => this.scene.start('MainMenuNewSession'),
      // в сцену можно передать данные для конкретных игр
      // joinSession: () => this.scene.start('MainMenuJoinSession', data),
      joinSession: () => this.scene.start('MainMenuJoinSession'),
    };
    this.menuCallBack = () => this.scene.switch('MainMenuPlay');
    createBg(this);
    createMenu(this, this.menuItems, true, this.menuCallBack);
    this.checkLang();
  }

  updateLang() {
    if (this.game.localeEng) {
      this.newSessionItem.setText('new session');
      this.joinSessionItem.setText('join session');
      this.menuItemBack.setText('back');
    } else {
      this.newSessionItem.setText('новая сессия');
      this.joinSessionItem.setText('присоединиться');
      this.menuItemBack.setText('назад');
    }
  }

  checkLang() {
    this.updateLang();
    this.events.on('wake', () => {
      if (this.eng !== this.game.localeEng) {
        this.updateLang();
        this.eng = this.game.localeEng;
      }
    });
  }
}
