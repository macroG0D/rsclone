import Phaser from 'phaser';
import { createMenu } from '../utils/createMenu';
import { createBg } from '../utils/createBg';
import { playMusic } from '../utils/music';

export default class MainMenu extends Phaser.Scene {
  constructor() {
    super('MainMenu');
  }

  create() {
    this.menuItems = {
      Play: () => {
        this.scene.switch('MainMenuPlay');
        window.location.hash = 'MainMenuPlay';
      },
      Leaderboard: () => this.scene.switch('MainMenuLeaderBoard'),
      Settings: () => this.scene.switch('MainMenuSettings'),
      Developers: () => this.scene.switch('MainMenuDevelopers'),
      About: () => window.open('https://github.com/macroG0D/rsclone'),
    };
    createBg(this);
    createMenu(this, this.menuItems);
    playMusic(this, 'main_menu_music');
    window.location.hash = this.scene.key;
    this.oldHash = window.location.hash.slice(1);
    window.onpopstate = () => {
      const hashKey = window.location.hash.slice(1);
      this.oldHash = hashKey;
      this.game.scene.bringToTop(hashKey);
      this.game.scene.run(hashKey);
    };
  }
}
