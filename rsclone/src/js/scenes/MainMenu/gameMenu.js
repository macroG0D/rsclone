import Phaser from 'phaser';

import {
  createMenu
} from '../../utils/createMenu';
import {
  createBg
} from '../../utils/createBg';

export default class GameMenu extends Phaser.Scene {
  constructor() {
    super('GameMenu');
  }

  create() {
    this.eng = this.game.localeEng;
    this.menuItems = {
      continue: () => {
        this.scene.resume('Score');
        this.scene.switch('Level1');
      },
      newGame: () => {
        this.scene.stop('Level1');
        this.scene.start('MainMenuPlay');
      },
      settings: () => this.scene.switch('MainMenuSettings'),
      mainMenu: () => {
        this.scene.stop('Level1');
        this.scene.start('MainMenu');
      },
    };
    createBg(this);
    createMenu(this, this.menuItems);
    this.checkLang();
  }

  updateLang() {
    if (this.game.localeEng) {
      this.continueItem.setText('continue');
      this.newGameItem.setText('new game');
      this.settingsItem.setText('settings');
      this.mainMenuItem.setText('main menu');
      this.menuItemBack.setText('back');
    } else {
      this.continueItem.setText('продолжить');
      this.newGameItem.setText('новая игра');
      this.settingsItem.setText('настройки');
      this.mainMenuItem.setText('главное меню');
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
