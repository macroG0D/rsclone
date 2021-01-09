import Phaser from 'phaser';
import { createMenu } from '../../utils/createMenu';
import { createBg } from '../../utils/createBg';

export default class GameMenu extends Phaser.Scene {
  constructor() {
    super('GameMenu');
  }

  create() {
    this.menuItems = {
      Continue: () => console.log('здесь будет колбек'),
      'New game': () => this.scene.start('MainMenuPlay'),
      // Leaderboard: () => this.scene.start('MainMenuLeaderBoard'),
      Settings: () => this.scene.start('MainMenuSettings'),
      'Main menu': () => this.scene.start('MainMenu'),
      // Developers: () => this.scene.start('MainMenuDevelopers'),
      // About: () => window.open('https://github.com/macroG0D/rsclone'),
    };
    createBg(this);
    createMenu(this, this.menuItems);
    this.music = this.sound.add('main_menu_music');
    // this.music.play({ loop: true });
  }
}
