import Phaser from 'phaser';
import Menu from '../components/menu';
import { playMusic } from '../utils/playMusic';

import { localization } from '../utils/localization';

export default class MainMenu extends Phaser.Scene {
  constructor() {
    super('MainMenu');
  }

  create() {
    const menuItems = {
      play: () => {
        this.scene.switch('MainMenuPlay');
      },
      leaderboard: () => this.scene.switch('MainMenuLeaderBoard'),
      settings: () => this.scene.switch('MainMenuSettings'),
      developers: () => this.scene.switch('MainMenuDevelopers'),
      about: () => window.open('https://github.com/macroG0D/rsclone'),
    };
    this.menu = new Menu(this, menuItems);
    playMusic(this);
    this.game.loadMenuScenes();
  }

  update() {
    if (this.game.isStarted) this.game.isStarted = false;
    localization(this);
  }
}
