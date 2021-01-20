import Phaser from 'phaser';

import { createMenu } from '../../utils/createMenu';
import { createImg } from '../../utils/createImg';

export default class MainMenuOnlineGame extends Phaser.Scene {
  constructor() {
    super('MainMenuOnlineGame');
  }

  create() {
    this.menuItems = {
      hostGame: () => this.scene.start('MainMenuOnlineGameHost'),
      joinGame: () => this.scene.start('MainMenuOnlineGameJoin'),
    };
    this.menuCallBack = () => this.scene.switch('MainMenuPlay');
    createImg(this);
    createMenu(this, this.menuItems, true, this.menuCallBack);
  }
}
