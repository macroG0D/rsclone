import Phaser from 'phaser';
import { createMenu } from '../utils/createMenu';
import { createBg } from '../utils/createBg';
import { playMusic } from '../utils/music';
import { LOCALE } from '../constants';

export default class MainMenu extends Phaser.Scene {
  constructor() {
    super('MainMenu');
  }

  create() {
    this.eng = this.game.localeEng;
    this.menuItems = {
      play: () => this.scene.switch('MainMenuPlay'),
      leaderboard: () => this.scene.switch('MainMenuLeaderBoard'),
      settings: () => this.scene.switch('MainMenuSettings'),
      developers: () => this.scene.switch('MainMenuDevelopers'),
      about: () => window.open('https://github.com/macroG0D/rsclone'),
    };
    createBg(this);
    createMenu(this, this.menuItems);
    playMusic(this, 'main_menu_music');
    this.checkLang();
  }

  updateLang() {
    if (this.game.localeEng) {
      this.playItem.setText(LOCALE.mainMenu.play.en);
      this.leaderboardItem.setText(LOCALE.mainMenu.leaderboard.en);
      this.settingsItem.setText(LOCALE.mainMenu.settings.en);
      this.developersItem.setText(LOCALE.mainMenu.developers.en);
      this.aboutItem.setText(LOCALE.mainMenu.about.en);
    } else {
      this.playItem.setText(LOCALE.mainMenu.play.ru);
      this.leaderboardItem.setText(LOCALE.mainMenu.leaderboard.ru);
      this.settingsItem.setText(LOCALE.mainMenu.settings.ru);
      this.developersItem.setText(LOCALE.mainMenu.developers.ru);
      this.aboutItem.setText(LOCALE.mainMenu.about.ru);
    }
  }

  checkLang() {
    if (!this.game.localeEng) this.updateLang();
    this.events.on('wake', () => {
      if (this.eng !== this.game.localeEng) {
        this.updateLang();
        this.eng = this.game.localeEng;
      }
    });
  }
}
