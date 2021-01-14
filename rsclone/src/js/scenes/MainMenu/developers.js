import Phaser from 'phaser';

import { createMenu } from '../../utils/createMenu';
import { createBg } from '../../utils/createBg';

export default class MainMenuDevelopers extends Phaser.Scene {
  constructor() {
    super('MainMenuDevelopers');
  }

  create() {
    this.eng = this.game.localeEng;
    this.menuItems = {
      macroG0D: () => window.open('https://github.com/macroG0D'),
      'i3-code': () => window.open('https://github.com/i3-code'),
      Heliken: () => window.open('https://github.com/Heliken'),
      mauta: () => window.open('https://github.com/mauta'),
    };
    createBg(this);
    createMenu(this, this.menuItems, true);
    this.createGithubIcons();
    if (!this.game.localeEng) {
      this.update();
    }
    this.events.on('wake', () => {
      if (this.eng !== this.game.localeEng) {
        this.update();
        this.eng = this.game.localeEng;
      }
    });
  }

  update() {
    if (this.game.localeEng) {
      this.menuItemBack.setText('back');
    } else {
      this.menuItemBack.setText('назад');
    }
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
