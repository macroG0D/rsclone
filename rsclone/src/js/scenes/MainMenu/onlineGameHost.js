import Phaser from 'phaser';

import { createMenu } from '../../utils/createMenu';
import { createBg } from '../../utils/createBg';

export default class MainMenuOnlineGame extends Phaser.Scene {
  constructor() {
    super('MainMenuOnlineGameHost');
  }

  create() {
    this.menuItems = {
      'Looking for a partner...': () => this.scene.switch('MainMenuOnlineGameHost'),
    };
    this.menuCallBack = () => this.scene.switch('MainMenuOnlineGame');
    this.createImg();
    createBg(this);
    createMenu(this, this.menuItems, true, this.menuCallBack);
    this.client = this.game.client;
    this.requestHostGame();
  }

  requestHostGame() {
    this.client.sendData('hostGame');
  }

  createImg() {
    this.add.image(314, 215, 'ibbImg');
    this.add.image(967, 215, 'obbImg');
    this.add.image(314, 437, 'ibbKeys');
    this.add.image(967, 437, 'obbKeys');
  }
}
