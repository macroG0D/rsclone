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
  }

  continue() {
    const { level } = this.game;
    const levelName = `Level${level}`;
    this.scene.wake(levelName);
    this.scene.stop();
  }

  mainMenu() {
    const { level } = this.game;
    const levelName = `Level${level}`;
    this.scene.stop(levelName);
    this.scene.wake('MainMenu');
    this.scene.stop();
  }
}
