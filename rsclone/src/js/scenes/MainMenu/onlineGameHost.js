import Phaser from 'phaser';

import { createMenu } from '../../utils/createMenu';
import { createImg } from '../../utils/createImg';

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
    createImg(this);
    this.menu = createMenu(this, this.menuItems, true, this.menuCallBack);
    this.client = this.game.client;
    this.client.on('hostGameSuccess', (sessionName) => {
      this.menu[0].item.setText(`${sessionName} awaiting connection...`);
    });
    this.client.on('gameReady', (sessionName) => {
      this.menu[0].item.setText(`${sessionName} ready!`);
      this.menu[0].item.off('pointerdown');
      this.menu[0].item.on('pointerdown', () => this.requestStartGame(sessionName));
    });
    this.client.on('startGame', (gameData) => this.scene.start('Level1', gameData));
    this.requestHostGame();
  }

  requestHostGame() {
    this.client.sendData('requestHostGame');
  }

  requestStartGame(sessionName) {
    this.client.sendData('requestStartGame', sessionName);
  }
}
