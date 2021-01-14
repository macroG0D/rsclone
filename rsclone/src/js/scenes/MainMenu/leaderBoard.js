import Phaser from 'phaser';

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
    if (!this.game.localeEng) {
      this.update();
    }
    this.events.on('wake', () => {
      if (this.eng !== this.game.localeEng) {
        this.update();
        this.eng = this.game.localeEng;
      }
    });
  }

  update() {
    if (this.game.localeEng) {
      this.leaderboardItem.setText('leaderboard');
      this.menuItemBack.setText('back');
    } else {
      this.leaderboardItem.setText('лидеры');
      this.menuItemBack.setText('назад');
    }
  }
}
