import Phaser from 'phaser';
import { LOCALE } from '../../constants';
import { createMenu } from '../../utils/createMenu';
import { createBg } from '../../utils/createBg';

export default class MainMenuPlay extends Phaser.Scene {
  constructor() {
    super('MainMenuPlay');
  }

  create() {
    this.eng = this.game.localeEng;
    this.menuItems = {
      localGame: () => this.scene.switch('MainMenuLocalGame'),
      onlineGame: () => this.scene.switch('MainMenuOnlineGame'),
    };
    createBg(this);
    createMenu(this, this.menuItems, true);
    this.checkLang();
  }

  updateLang() {
    if (this.game.localeEng) {
      this.localGameItem.setText(LOCALE.play.localGame.en);
      this.onlineGameItem.setText(LOCALE.play.onlineGame.en);
      this.menuItemBack.setText(LOCALE.play.back.en);
    } else {
      this.localGameItem.setText(LOCALE.play.localGame.ru);
      this.onlineGameItem.setText(LOCALE.play.onlineGame.ru);
      this.menuItemBack.setText(LOCALE.play.back.ru);
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
