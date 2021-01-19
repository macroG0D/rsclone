import Phaser from 'phaser';
import { createMenu } from '../utils/createMenu';
import { createBg } from '../utils/createBg';
import { playMusic } from '../utils/playMusic';

export default class MainMenu extends Phaser.Scene {
  constructor() {
    super('MainMenu');
  }

  create() {
    this.menuItems = {
      Play: () => {
        this.scene.switch('MainMenuPlay');
      },
      Leaderboard: () => this.scene.switch('MainMenuLeaderBoard'),
      Settings: () => this.scene.switch('MainMenuSettings'),
      Developers: () => this.scene.switch('MainMenuDevelopers'),
      About: () => window.open('https://github.com/macroG0D/rsclone'),
    };
    createBg(this);
    createMenu(this, this.menuItems);
    playMusic(this);
  }
}
