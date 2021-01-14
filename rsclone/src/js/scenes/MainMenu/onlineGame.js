import Phaser from 'phaser';

import { createMenu } from '../../utils/createMenu';
import { createBg } from '../../utils/createBg';

export default class MainMenuOnlineGame extends Phaser.Scene {
  constructor() {
    super('MainMenuOnlineGame');
  }

  create() {
    this.eng = this.game.localeEng;
    this.menuItems = {
      newSession: () => this.scene.start('MainMenuNewSession'),
      joinSession: () => this.scene.start('Level1'),
    };
    this.menuCallBack = () => this.scene.switch('MainMenuPlay');
    this.createImg();
    createBg(this);
    createMenu(this, this.menuItems, true, this.menuCallBack);
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
      this.newSessionItem.setText('new session');
      this.joinSessionItem.setText('join session');
      this.menuItemBack.setText('back');
    } else {
      this.newSessionItem.setText('новая сессия');
      this.joinSessionItem.setText('присоединиться');
      this.menuItemBack.setText('назад');
    }
  }

  createImg() {
    this.add.image(314, 215, 'ibbImg');
    this.add.image(967, 215, 'obbImg');
    this.add.image(314, 437, 'ibbKeys');
    this.add.image(967, 437, 'obbKeys');
  }
}
