import Phaser from 'phaser';
import Menu from '../components/menu';

import { localization } from '../engine/localization';

export default class MainMenu extends Phaser.Scene {
  constructor() {
    super('MainMenu');
  }

  create() {
    const { level, time, score } = this.game.app.settings;
    let menuItems = {
      newGame: () => this.scene.start('MainMenuPlay'),
      leaderboard: () => this.scene.start('MainMenuLeaderBoard'),
      settings: () => this.scene.start('MainMenuSettings'),
      developers: () => this.scene.start('MainMenuDevelopers'),
      about: () => window.open('https://github.com/macroG0D/rsclone'),
    };
    /* if (level > 1) {
      menuItems = {
        continue: () => this.continueGame({ level, time, score }), ...menuItems,
      };
    }  */
    this.menu = new Menu(this, menuItems);
  }

  continueGame(data) {
    const { level } = data;
    this.scene.start(`Level${level}`, data);
  }

  update() {
    if (this.game.isStarted) this.game.isStarted = false;
    if (this.scene.key !== this.game.music.key) this.game.music.play(this);
    localization(this);
  }
}
