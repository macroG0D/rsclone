import Phaser from 'phaser';

import { createMenu } from '../../utils/createMenu';

export default class GameMenu extends Phaser.Scene {
  constructor() {
    super('GameMenu');
  }

  create() {
    this.menuItems = {
      сontinue: () => {
        this.scene.resume('Score');
        this.scene.switch('Level1');
      },
      newGame: () => {
        this.scene.stop('Level1');
        this.scene.start('MainMenuPlay');
      },
      settings: () => this.scene.switch('MainMenuSettings'),
      mainMenu: () => {
        this.scene.stop('Level1');
        this.scene.start('MainMenu');
      },
    };
    createMenu(this, this.menuItems);
  }
}
