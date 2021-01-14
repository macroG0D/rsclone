import Phaser from 'phaser';
import {
  createMenu
} from '../utils/createMenu';
import {
  createBg
} from '../utils/createBg';
import {
  playMusic
} from '../utils/music';

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
      this.playItem.setText('play');
      this.leaderboardItem.setText('leaderboard');
      this.settingsItem.setText('settings');
      this.developersItem.setText('developers');
      this.aboutItem.setText('about');
    } else {
      this.playItem.setText('играть');
      this.leaderboardItem.setText('лидеры');
      this.settingsItem.setText('настройки');
      this.developersItem.setText('разработчики');
      this.aboutItem.setText('о нас');
    }
  }
}
