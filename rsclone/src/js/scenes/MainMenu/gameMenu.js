import Phaser from 'phaser';

import Menu from '../../components/menu';

import { localization } from '../../utils/localization';

export default class GameMenu extends Phaser.Scene {
  constructor() {
    super('GameMenu');
  }

  create() {
    const menuItems = {
      continue: () => this.scene.switch('Level1'),
      settings: () => this.scene.switch('MainMenuSettings'),
      mainMenu: () => this.game.runScene('MainMenu'),
    };
    console.log('creating menu!');
    this.menu = new Menu(this, menuItems);
  }

  update() {
    localization(this);
  }
}
