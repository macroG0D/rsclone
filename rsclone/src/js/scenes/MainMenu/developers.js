import Phaser from 'phaser';

import { createMenu } from '../../utils/createMenu';

export default class MainMenuDevelopers extends Phaser.Scene {
  constructor() {
    super('MainMenuDevelopers');
  }

  create() {
    this.menuItems = {
      macroG0D: () => window.open('https://github.com/macroG0D'),
      'i3-code': () => window.open('https://github.com/i3-code'),
      Heliken: () => window.open('https://github.com/Heliken'),
      mauta: () => window.open('https://github.com/mauta'),
    };
    createMenu(this, this.menuItems, true);
    this.createGithubIcons();
  }

  createGithubIcons() {
    const menuItemsCount = Object.keys(this.menuItems).length;
    for (let menuIndex = 0; menuIndex < menuItemsCount; menuIndex += 1) {
      this.add.image(this.cameras.main.centerX - 140,
        (this.game.config.height / 2 + (menuItemsCount * 30)) - (60 * menuIndex),
        'githubIcon');
    }
  }
}
