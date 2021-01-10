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
      Play: () => this.scene.start('MainMenuPlay'),
      Leaderboard: () => this.scene.start('MainMenuLeaderBoard'),
      Settings: () => this.scene.start('MainMenuSettings'),
      Developers: () => this.scene.start('MainMenuDevelopers'),
      About: () => window.open('https://github.com/macroG0D/rsclone'),
    };
    createBg(this);
    createMenu(this, this.menuItems);
    playMusic(this, 'main_menu_music');
  }
}
