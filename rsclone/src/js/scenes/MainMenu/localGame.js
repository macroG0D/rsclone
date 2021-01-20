import Phaser from 'phaser';

import Menu from '../../components/menu';
import { createImg } from '../../utils/createImg';

export default class MainMenuLocalGame extends Phaser.Scene {
  constructor() {
    super('MainMenuLocalGame');
  }

  create() {
    createImg(this, true);
    const menuItems = {
      startGame: () => this.scene.start('Level1'),
    };
    const menuCallBack = () => this.scene.switch('MainMenuPlay');
    this.menu = new Menu(this, menuItems, true, menuCallBack);
  }
}
