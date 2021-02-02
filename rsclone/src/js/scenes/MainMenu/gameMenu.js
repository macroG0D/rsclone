import Phaser from 'phaser';

import Menu from '../../components/menu';

import { localization } from '../../engine/localization';

export default class GameMenu extends Phaser.Scene {
  constructor() {
    super('GameMenu');
  }

  create() {
    const menuItems = {
      continue: this.continue.bind(this),
      settings: () => this.scene.switch('MainMenuSettings'),
      mainMenu: this.mainMenu.bind(this),
    };
    this.menu = new Menu(this, menuItems);
  }

  update() {
    localization(this);
    if (this.menu) {
      const x = this.game.config.width / 2;
      const y = this.game.config.height / 2;
      this.menu.spawn.x = x;
      this.menu.spawn.y = y;
      this.menu.spawn.setOrigin(0.5);
    }
  }

  continue() {
    const { level } = this.game;
    const levelName = `Level${level}`;
    this.scene.stop();
    this.scene.wake(levelName);
  }

  mainMenu() {
    const { level } = this.game;
    const levelName = `Level${level}`;
    this.scene.stop(levelName);
    this.scene.start('MainMenu');
  }
}
