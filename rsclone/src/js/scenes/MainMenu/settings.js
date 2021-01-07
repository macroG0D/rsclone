import Phaser from 'phaser';

import { createMenu } from '../../utils/createMenu';
import { createBg } from '../../utils/createBg';

export default class MainMenuSettings extends Phaser.Scene {
  constructor() {
    super('MainMenuSettings');
  }

  create() {
    this.menuItems = {
      'Settings': () => this.scene.start('MainMenu'),
    };
    createBg(this);
    createMenu(this, this.menuItems, true);
  }
}
