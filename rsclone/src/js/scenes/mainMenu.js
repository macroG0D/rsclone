import Phaser from 'phaser';
import { createMenu } from '../utils/createMenu';
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
    createMenu(this, this.menuItems);
    playMusic(this);
  }
}
