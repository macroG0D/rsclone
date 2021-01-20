import Phaser from 'phaser';

import Menu from '../../components/menu';

export default class MainMenuPlay extends Phaser.Scene {
  constructor() {
    super('MainMenuSettings');
  }

  create() {
    const menuItems = {
      fullscreen: () => {},
      music: () => {},
      sound: () => {},
      language: () => {},
    };
    const menuCallBack = () => this.back();
    this.menu = new Menu(this, menuItems, true, menuCallBack);
  }

  back() {
    this.scene.switch((this.game.isStarted) ? 'GameMenu' : 'MainMenu');
  }
}
