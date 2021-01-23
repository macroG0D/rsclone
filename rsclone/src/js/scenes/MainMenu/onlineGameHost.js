import Phaser from 'phaser';

import Menu from '../../components/menu';
import { createImg } from '../../utils/createImg';

import { localization } from '../../utils/localization';

export default class MainMenuOnlineGame extends Phaser.Scene {
  constructor() {
    super('MainMenuOnlineGameHost');
  }

  create() {
    createImg(this);
    const menuItems = {
      'Looking for a partner...': '',
    };
    const menuCallBack = () => {
      this.client.sendData('requestDropGame');
      this.scene.switch('MainMenuOnlineGame');
    };
    this.menu = new Menu(this, menuItems, true, menuCallBack);
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

  update() {
    localization(this);
  }
}
