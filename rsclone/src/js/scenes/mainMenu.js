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
      play: () => {
        this.scene.switch('MainMenuPlay');
      },
      leaderboard: () => this.scene.switch('MainMenuLeaderBoard'),
      settings: () => this.scene.switch('MainMenuSettings'),
      developers: () => this.scene.switch('MainMenuDevelopers'),
      about: () => window.open('https://github.com/macroG0D/rsclone'),
    };
    createBg(this);
    createMenu(this, this.menuItems, true);
    playMusic(this);
    // this.menu = new Menu().node;
    // const element = this.add.dom(400, 300, this.menu);
  }
}
