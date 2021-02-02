import Phaser from 'phaser';

import Menu from '../../components/menu';

import { localization } from '../../engine/localization';

export default class MainMenuPlay extends Phaser.Scene {
  constructor() {
    super('MainMenuPlay');
  }

  create() {
    const menuItems = {
      localGame: () => this.scene.start('MainMenuLocalGame'),
      onlineGame: () => this.scene.start('MainMenuOnlineGame'),
    };
    this.menu = new Menu(this, menuItems, true);
  }

  update() {
    if (this.game.isStarted) this.game.isStarted = false;
    localization(this);
  }
}
