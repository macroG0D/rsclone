import Phaser from 'phaser';

import { createMenu } from '../../utils/createMenu';
import { createBg } from '../../utils/createBg';

export default class MainMenuPlay extends Phaser.Scene {
  constructor() {
    super('MainMenuPlay');
  }

  create() {
    this.menuItems = {
      'Local Game': () => this.scene.switch('MainMenuLocalGame'),
      'Online Game': () => this.scene.switch('MainMenuOnlineGame'),
    };
    createBg(this);
    createMenu(this, this.menuItems, true);
    window.location.hash = this.scene.key;
  }
}
