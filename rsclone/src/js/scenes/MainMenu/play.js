import Phaser from 'phaser';

import { createMenu } from '../../utils/createMenu';
import { createBg } from '../../utils/createBg';

export default class MainMenuPlay extends Phaser.Scene {
  constructor() {
    super('MainMenuPlay');
  }

  create() {
    this.menuItems = {
      'Local Game': () => this.scene.start('MainMenuLocalGame'),
      'Invite a friend': () => this.scene.start('MainMenuOnlineGame'),
    };
    createBg(this);
    createMenu(this, this.menuItems, true);
    console.log('cjplfkb')
    // window.location.hash = this.scene.key;
  }
}
