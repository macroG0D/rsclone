import Phaser from 'phaser';

import Menu from '../../components/menu';

import { localization } from '../../utils/localization';

export default class GameMenu extends Phaser.Scene {
  constructor() {
    super('GameMenu');
  }

  create() {
    const menuItems = {
      continue: () => {
        this.scene.resume('Score');
        this.scene.switch('Level1');
      },
      newGame: () => {
        this.scene.stop('Score');
        this.scene.stop('Level1');
        this.scene.stop(this.key);
        this.scene.switch('MainMenuPlay');
      },
      settings: () => this.scene.switch('MainMenuSettings'),
      mainMenu: () => {
        this.scene.stop('Score');
        this.scene.stop('Level1');
        this.scene.stop(this.key);
        this.scene.switch('MainMenu');
      },
    };
    this.menu = new Menu(this, menuItems);
  }

  update() {
    localization(this);
  }
}
