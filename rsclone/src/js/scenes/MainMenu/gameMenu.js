import Phaser from 'phaser';

import { createMenu } from '../../utils/createMenu';

export default class GameMenu extends Phaser.Scene {
  constructor() {
    super('GameMenu');
  }

  create() {
    this.menuItems = {
      Continue: () => {
        this.scene.resume('Score');
        this.scene.switch('Level1');
      },
      'New game': () => {
        this.scene.stop('Level1');
        this.scene.start('MainMenuPlay');
      },
      Settings: () => this.scene.switch('MainMenuSettings'),
      'Main menu': () => {
        this.scene.stop('Level1');
        this.scene.start('MainMenu');
      },
    };
    createMenu(this, this.menuItems);
  }
}
