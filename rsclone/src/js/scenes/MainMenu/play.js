import Phaser from 'phaser';

import { createMenu } from '../../utils/createMenu';
import { createBg } from '../../utils/createBg';

export default class MainMenuPlay extends Phaser.Scene {
  constructor() {
    super('MainMenuPlay');
  }

  create() {
    this.eng = this.game.localeEng;
    this.menuItems = {
      localGame: () => this.scene.switch('MainMenuLocalGame'),
      onlineGame: () => this.scene.switch('MainMenuOnlineGame'),
    };
    createBg(this);
    createMenu(this, this.menuItems, true);
    this.update();
    this.events.on('wake', () => {
      if (this.eng !== this.game.localeEng) {
        this.update();
        this.eng = this.game.localeEng;
      }
    });
  }

  update() {
    if (this.game.localeEng) {
      this.localGameItem.setText('local game');
      this.onlineGameItem.setText('online game');
      this.menuItemBack.setText('back');
    } else {
      this.localGameItem.setText('локальная игра');
      this.onlineGameItem.setText('онлайн игра');
      this.menuItemBack.setText('назад');
    }
  }
}
