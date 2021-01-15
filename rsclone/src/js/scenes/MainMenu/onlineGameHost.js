import Phaser from 'phaser';

import { createMenu } from '../../utils/createMenu';
import { createBg } from '../../utils/createBg';

export default class MainMenuOnlineGame extends Phaser.Scene {
  constructor() {
    super('MainMenuOnlineGameHost');
  }

  create() {
    this.menuItems = {
      'Looking for a partner...': () => this.scene.switch('MainMenuOnlineGameHost'),
    };
    this.menuCallBack = () => {
      this.client.sendData('requestDropGame');
      this.scene.stop();
      this.scene.switch('MainMenuOnlineGame');
    };
    createBg(this);
    this.createImg();
    this.menu = createMenu(this, this.menuItems, true, this.menuCallBack);
    this.client = this.game.client;
    this.client.on('hostGameSuccess', (sessionName) => {
      this.menu[0].item.setText(`${sessionName} awaiting connection...`);
    });
    this.requestHostGame();
  }

  requestHostGame() {
    this.client.sendData('requestHostGame');
  }

  createImg() {
    this.add.image(314, 215, 'ibbBg');
    this.ibb = this.add.image(314, 215, 'ibbImg');
    this.animate(this.ibb, 0);
    this.add.image(967, 215, 'obbBg');
    this.obb = this.add.image(967, 215, 'obbImg');
    this.animate(this.obb, 1000);
  }

  animate(character, delay) {
    this.tweens.add({
      targets: character,
      scale: 1.1,
      ease: 'Linear',
      duration: 1000,
      delay,
      yoyo: true,
      repeat: -1,
    });
  }
}
