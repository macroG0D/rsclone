import Phaser from 'phaser';

import { createMenu } from '../../utils/createMenu';
import { createBg } from '../../utils/createBg';
import { createImg } from '../../utils/createImg';

export default class MainMenuLocalGame extends Phaser.Scene {
  constructor() {
    super('MainMenuLocalGame');
  }

  create() {
    this.menuItems = {
      'Start Game': () => this.scene.start('Level1'),
    };
    this.menuCallBack = () => this.scene.switch('MainMenuPlay');
    createBg(this);
    createImg(this);
    createMenu(this, this.menuItems, true, this.menuCallBack);
    window.location.hash = this.scene.key;
  }
}
