import Phaser from 'phaser';

import Menu from '../../components/menu';
import { createImg } from '../../utils/createImg';

import { localization } from '../../utils/localization';

export default class MainMenuLocalGame extends Phaser.Scene {
  constructor() {
    super('MainMenuLocalGame');
  }

  create() {
    const { level } = this.game;
    const levelName = `Level${level}`;
    createImg(this, true);
    const menuItems = {
      startGame: () => this.scene.start(levelName),
    };
    const menuCallBack = () => this.scene.switch('MainMenuPlay');
    this.menu = new Menu(this, menuItems, true, menuCallBack);
  }

  update() {
    localization(this);
  }
}
