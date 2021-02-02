import Phaser from 'phaser';

import Menu from '../../components/menu';
import { createImg } from '../../utils/createImg';

import { localization } from '../../engine/localization';

export default class MainMenuLocalGame extends Phaser.Scene {
  constructor() {
    super('MainMenuLocalGame');
  }

  create() {
    createImg(this, true);
    const menuItems = {
      startGame: () => this.startGame(),
    };
    const menuCallBack = () => this.scene.switch('MainMenuPlay');
    this.menu = new Menu(this, menuItems, true, menuCallBack);
  }

  update() {
    localization(this);
  }

  startGame() {
    this.game.app.settings.level = 1;
    this.game.app.settings.score = 0;
    this.game.app.settings.time = 0;
    this.scene.start('Level1');
  }
}
