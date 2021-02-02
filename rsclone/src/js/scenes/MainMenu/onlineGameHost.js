import Phaser from 'phaser';

import Menu from '../../components/menu';
import { createImg } from '../../utils/createImg';

import { localization } from '../../engine/localization';

export default class MainMenuOnlineGame extends Phaser.Scene {
  constructor() {
    super('MainMenuOnlineGameHost');
  }

  create() {
    createImg(this);
    let menuItems = {
      'Looking for a partner...': '',
    };
    const menuCallBack = () => {
      this.client.sendData('requestDropGame');
      this.scene.start('MainMenuOnlineGame');
    };
    this.menu = new Menu(this, menuItems, true, menuCallBack);
    this.client = this.game.client;
    this.client.on('hostGameSuccess', (sessionName) => {
      this.menu.items[0].node.innerHTML = `${sessionName} awaiting connection...`;
    });
    this.client.on('gameReady', (sessionName) => {
      this.menu.spawn.destroy();
      menuItems = {};
      menuItems[`${sessionName} ready!`] = () => this.requestStartGame(sessionName);
      this.menu = new Menu(this, menuItems, true, menuCallBack);
    });
    this.client.on('startGame', (gameData) => this.startGame(gameData));
    this.requestHostGame();
  }

  startGame(gameData) {
    this.game.app.settings.level = 1;
    this.game.app.settings.score = 0;
    this.game.app.settings.time = 0;
    this.game.app.saveSettings();
    this.scene.start('Level1', gameData);
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
