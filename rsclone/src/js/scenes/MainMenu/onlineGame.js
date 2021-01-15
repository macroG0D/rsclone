import Phaser from 'phaser';
import { LOCALE } from '../../constants';
import { createMenu } from '../../utils/createMenu';
import { createBg } from '../../utils/createBg';

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
      this.newSessionItem.setText(LOCALE.onlineGame.newSession.en);
      this.joinSessionItem.setText(LOCALE.onlineGame.joinSession.en);
      this.menuItemBack.setText(LOCALE.onlineGame.back.en);
    } else {
      this.newSessionItem.setText(LOCALE.onlineGame.newSession.ru);
      this.joinSessionItem.setText(LOCALE.onlineGame.joinSession.ru);
      this.menuItemBack.setText(LOCALE.onlineGame.back.ru);
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
