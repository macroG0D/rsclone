import Phaser from 'phaser';

import Menu from '../../components/menu';
import { createImg } from '../../utils/createImg';

import { localization } from '../../utils/localization';

export default class MainMenuOnlineGame extends Phaser.Scene {
  constructor() {
    super('MainMenuOnlineGameHost');
  }

  create() {
    const { level } = this.game;
    const levelName = `Level${level}`;
    createImg(this);
    const menuItems = {
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
      this.menu.items[0].node.innerHTML = `${sessionName} ready!`;
      this.menu.items[0].link = () => this.requestStartGame(sessionName);
    });
    this.client.on('startGame', (gameData) => this.scene.start(levelName, gameData));
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
