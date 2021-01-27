import Phaser from 'phaser';

import Menu from '../../components/menu';

import { localization } from '../../engine/localization';

export default class GameMenu extends Phaser.Scene {
  constructor() {
    super('GameMenu');
  }

  create() {
    const { level } = this.game;
    const levelName = `Level${level}`;
    const menuItems = {
      continue: () => this.scene.switch(levelName),
      settings: () => this.scene.switch('MainMenuSettings'),
      mainMenu: () => {
        this.scene.stop(levelName);
        this.scene.switch('MainMenu');
      },
    };
    this.menu = new Menu(this, menuItems);
  }

  update() {
    localization(this);
  }
}
