import Phaser from 'phaser';

import { createMenu } from '../../utils/createMenu';
import { createBg } from '../../utils/createBg';

export default class MainMenuLocalGame extends Phaser.Scene {
  constructor() {
    super('MainMenuLocalGame');
  }

  create() {
    this.menuItems = {
      'Start Game': () => this.scene.start('Level1'),
    };
    this.menuCallBack = () => this.scene.start('MainMenuPlay');
    createBg(this);
    this.createImg();
    createMenu(this, this.menuItems, true, this.menuCallBack);
  }

  createImg() {
    this.add.image(314, 215, 'ibbImg');
    this.add.image(967, 215, 'obbImg');
    this.add.image(314, 437, 'ibbKeys');
    this.add.image(967, 437, 'obbKeys');
  }
}
