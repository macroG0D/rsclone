import Phaser from 'phaser';

import {
  createMenu
} from '../../utils/createMenu';
import {
  createBg
} from '../../utils/createBg';

export default class MainMenuLocalGame extends Phaser.Scene {
  constructor() {
    super('MainMenuLocalGame');
  }

  create() {
    this.eng = this.game.localeEng;
    this.menuItems = {
      startGame: () => this.scene.start('Level1'),
    };
    this.menuCallBack = () => this.scene.switch('MainMenuPlay');
    createBg(this);
    this.createImg();
    createMenu(this, this.menuItems, true, this.menuCallBack);
    this.checkLang();
    this.startGameItem.setY(437);
  }

  updateLang() {
    if (this.game.localeEng) {
      this.startGameItem.setText('start game');
      this.menuItemBack.setText('back');
    } else {
      this.startGameItem.setText('начать игру');
      this.menuItemBack.setText('назад');
    }
  }

  createImg() {
    this.add.image(314, 215, 'ibbBg');
    this.ibb = this.add.image(314, 215, 'ibbImg');
    this.anim(this.ibb, 0);
    this.add.image(967, 215, 'obbBg');
    this.obb = this.add.image(967, 215, 'obbImg');
    this.anim(this.obb, 1000);
    this.add.image(314, 437, 'ibbKeys');
    this.add.image(967, 437, 'obbKeys');
  }

  anim(person, delayTime) {
    this.tweens.add({
      targets: person,
      scale: 1.1,
      ease: 'Linear',
      duration: 1000,
      delay: delayTime,
      yoyo: true,
      repeat: -1,
    });
  }

  checkLang() {
    this.updateLang();
    this.events.on('wake', () => {
      if (this.eng !== this.game.localeEng) {
        this.updateLang();
        this.eng = this.game.localeEng;
      }
    });
  }
}
