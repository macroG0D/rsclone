import Phaser from 'phaser';
import { LOCALE } from '../../constants';
import { createMenu } from '../../utils/createMenu';
import { createBg } from '../../utils/createBg';

export default class MainMenuLeaderBoard extends Phaser.Scene {
  constructor() {
    super('MainMenuLeaderBoard');
  }

  create() {
    this.eng = this.game.localeEng;
    this.menuItems = {
      leaderboard: () => this.scene.switch('MainMenu'),
    };
    createBg(this);
    createMenu(this, this.menuItems, true);
    this.checkLang();
  }

  updateLang() {
    if (this.game.localeEng) {
      this.leaderboardItem.setText(LOCALE.leaderboard.leaderboard.en);
      this.menuItemBack.setText(LOCALE.leaderboard.back.en);
    } else {
      this.leaderboardItem.setText(LOCALE.leaderboard.leaderboard.ru);
      this.menuItemBack.setText(LOCALE.leaderboard.back.ru);
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
