import Phaser from 'phaser';

import { createMenu } from '../../utils/createMenu';
import { createImg } from '../../utils/createImg';

export default class MainMenuLocalGame extends Phaser.Scene {
  constructor() {
    super('MainMenuLocalGame');
  }

  create() {
    this.menuItems = {
      startGame: () => this.scene.start('Level1'),
    };
    this.menuCallBack = () => this.scene.switch('MainMenuPlay');
    createImg(this, true);
    createMenu(this, this.menuItems, true, this.menuCallBack);
  }
}
