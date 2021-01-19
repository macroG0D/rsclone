import Phaser from 'phaser';

import { createMenu } from '../../utils/createMenu';

export default class MainMenuPlay extends Phaser.Scene {
  constructor() {
    super('MainMenuPlay');
  }

  create() {
    this.menuItems = {
      'Local Game': () => this.scene.switch('MainMenuLocalGame'),
      'Online Game': () => this.scene.switch('MainMenuOnlineGame'),
    };
    createMenu(this, this.menuItems, true);
  }
}
