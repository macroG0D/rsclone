import Phaser from 'phaser';

import Menu from '../../components/menu';
import { createImg } from '../../utils/createImg';

import { localization } from '../../utils/localization';

export default class MainMenuOnlineGame extends Phaser.Scene {
  constructor() {
    super('MainMenuOnlineGame');
  }

  create() {
    createImg(this);
    const menuItems = {
      hostGame: () => this.scene.start('MainMenuOnlineGameHost'),
      joinGame: () => this.scene.start('MainMenuOnlineGameJoin'),
    };
    const menuCallBack = () => this.scene.switch('MainMenuPlay');
    this.menu = new Menu(this, menuItems, true, menuCallBack);
  }

  update() {
    localization(this);
  }
}
