import Phaser from 'phaser';

import Menu from '../../components/menu';
import { createImg } from '../../utils/createImg';

import { localization } from '../../utils/localization';

export default class MainMenuOnlineGame extends Phaser.Scene {
  constructor() {
    super('MainMenuOnlineGameJoin');
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
    this.client.on('requestGamesSuccess', (sessionNames) => {
      this.menu.spawn.destroy();
      menuItems = {};
      sessionNames.forEach((sessionName) => {
        menuItems[sessionName] = () => this.joinGame(sessionName);
      });
      if (!sessionNames.length) menuItems['No games hosted'] = '';
      this.menu = new Menu(this, menuItems, true, menuCallBack);
    });
    this.client.on('gameReady', (sessionName) => {
      this.menu.items[0].node.innerHTML = `${sessionName} ready!`;
      this.menu.items[0].link = () => this.requestStartGame(sessionName);
      for (let itemIndex = 1; itemIndex < this.menu.length - 1; itemIndex += 1) {
        if (this.menu.items[itemIndex].node) this.menu.items[itemIndex].node.innerHTML = '';
      }
    });
    this.client.on('startGame', (gameData) => this.scene.start('Level1', gameData));
    this.requestJoinGame();
  }

  requestJoinGame() {
    this.client.sendData('requestGames');
  }

  joinGame(sessionName) {
    this.client.sendData('joinGame', sessionName);
  }

  requestStartGame(sessionName) {
    this.client.sendData('requestStartGame', sessionName);
  }

  update() {
    localization(this);
  }
}
