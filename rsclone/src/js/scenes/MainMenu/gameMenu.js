import Phaser from 'phaser';

import Menu from '../../components/menu';

export default class GameMenu extends Phaser.Scene {
  constructor() {
    super('GameMenu');
  }

  create() {
    const menuItems = {
      сontinue: () => {
        this.scene.resume('Score');
        this.scene.switch('Level1');
      },
      newGame: () => {
        this.scene.stop('Level1');
        this.scene.stop('Score');
        this.scene.switch('MainMenuPlay');
      },
      settings: () => this.scene.switch('MainMenuSettings'),
      mainMenu: () => {
        this.scene.stop('Level1');
        this.scene.stop('Score');
        this.scene.switch('MainMenu');
      },
    };
    this.menu = new Menu(this, menuItems);
  }
}
