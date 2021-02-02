import Phaser from 'phaser';

import Menu from '../../components/menu';
import { createImg } from '../../utils/createImg';

import { localization } from '../../engine/localization';

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
      this.menu.spawn.destroy();
      menuItems = {};
      menuItems[`${sessionName} ready!`] = () => this.requestStartGame(sessionName);
      this.menu = new Menu(this, menuItems, true, menuCallBack);
    });
    this.client.on('startGame', (gameData) => this.startGame(gameData));
    this.requestJoinGame();
  }

  startGame(gameData) {
    this.game.app.settings.level = 1;
    this.game.app.settings.score = 0;
    this.game.app.settings.time = 0;
    this.scene.start('Level1', gameData);
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
