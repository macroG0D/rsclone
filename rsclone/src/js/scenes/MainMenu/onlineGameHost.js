import Phaser from 'phaser';

import Menu from '../../components/menu';
import { createImg } from '../../utils/createImg';

import { localization } from '../../engine/localization';

export default class MainMenuOnlineGame extends Phaser.Scene {
  constructor() {
    super('MainMenuOnlineGameHost');
  }

  create() {
    this.colyseus = this.game.colyseus;
    createImg(this);
    let menuItems = {
      'Retrieving game name...': '',
    };
    const menuCallBack = () => {
      // this.client.sendData('requestDropGame');
      this.scene.start('MainMenuOnlineGame');
    };
    this.menu = new Menu(this, menuItems, true, menuCallBack);

    if (this.colyseus) {
      this.colyseus = this.game.colyseus;
      this.colyseus.off('getRoom');
      this.colyseus.on('getRoom', this.onGetRoom, this);
      this.colyseus.on('joinRoom', this.onJoinRoom, this);
      this.colyseus.sendData('getRoom');
    }

    /*
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
    this.client.on('startGame', (gameData) => this.scene.start(levelName, gameData));
    this.requestHostGame();
    */
  }

  onGetRoom(name) {
    if (this.menu) {
      this.menu.items[0].node.innerHTML = `Connecting to ${name} room...`;
      this.colyseus.joinRoom(name);
    }
  }

  onJoinRoom(name) {

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
