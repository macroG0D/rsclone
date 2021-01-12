import Phaser from 'phaser';

import { createMenu } from '../../utils/createMenu';
import { createBg } from '../../utils/createBg';

export default class MainMenuOnlineGame extends Phaser.Scene {
  constructor() {
    super('MainMenuOnlineGame');
  }

  create() {
    this.menuItems = {
      'Start Game': () => this.scene.run('Level1'),
    };
    this.menuCallBack = () => this.scene.start('MainMenuPlay');
    this.createImg();
    createBg(this);
    createMenu(this, this.menuItems, true, this.menuCallBack);
    window.location.hash = this.scene.key;
  }

  createImg() {
    this.add.image(314, 215, 'ibbImg');
    this.add.image(967, 215, 'obbImg');
    this.add.image(314, 437, 'ibbKeys');
    this.add.image(967, 437, 'obbKeys');
  }
}
