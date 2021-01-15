import Phaser from 'phaser';
import { LOCALE } from '../../constants';
import { createMenu } from '../../utils/createMenu';
import { createBg } from '../../utils/createBg';

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
      this.continueItem.setText(LOCALE.gameMenu.continue.en);
      this.newGameItem.setText(LOCALE.gameMenu.newGame.en);
      this.settingsItem.setText(LOCALE.gameMenu.settings.en);
      this.mainMenuItem.setText(LOCALE.gameMenu.mainMenu.en);
    } else {
      this.continueItem.setText(LOCALE.gameMenu.continue.ru);
      this.newGameItem.setText(LOCALE.gameMenu.newGame.ru);
      this.settingsItem.setText(LOCALE.gameMenu.settings.ru);
      this.mainMenuItem.setText(LOCALE.gameMenu.mainMenu.ru);
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
