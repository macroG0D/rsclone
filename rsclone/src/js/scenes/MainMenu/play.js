import Phaser from 'phaser';

import Menu from '../../components/menu';

import { localization } from '../../utils/localization';

export default class MainMenuPlay extends Phaser.Scene {
  constructor() {
    super('MainMenuPlay');
  }

  create() {
    const menuItems = {
      localGame: () => this.scene.switch('MainMenuLocalGame'),
      onlineGame: () => this.scene.switch('MainMenuOnlineGame'),
    };
    this.menu = new Menu(this, menuItems, true);
  }

  update() {
    if (this.game.isStarted) this.game.isStarted = false;
    localization(this);
  }
}
