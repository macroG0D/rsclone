import Phaser from 'phaser';

import { createMenu } from '../../utils/createMenu';

export default class MainMenuPlay extends Phaser.Scene {
  constructor() {
    super('MainMenuPlay');
  }

  create() {
    this.menuItems = {
      localGame: () => this.scene.switch('MainMenuLocalGame'),
      onlineGame: () => this.scene.switch('MainMenuOnlineGame'),
    };
    createMenu(this, this.menuItems, true);
  }
}
