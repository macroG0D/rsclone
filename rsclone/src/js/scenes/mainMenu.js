import Phaser from 'phaser';
import Menu from '../components/menu';

import { localization } from '../engine/localization';

export default class MainMenu extends Phaser.Scene {
  constructor() {
    super('MainMenu');
  }

  create() {
    const menuItems = {
      play: () => this.scene.switch('MainMenuPlay'),
      leaderboard: () => this.scene.start('MainMenuLeaderBoard'),
      settings: () => this.scene.switch('MainMenuSettings'),
      developers: () => this.scene.switch('MainMenuDevelopers'),
      about: () => window.open('https://github.com/macroG0D/rsclone'),
    };
    this.menu = new Menu(this, menuItems);
  }

  update() {
    if (this.game.isStarted) this.game.isStarted = false;
    if (this.scene.key !== this.game.music.key) this.game.music.play(this);
    localization(this);
  }
}
