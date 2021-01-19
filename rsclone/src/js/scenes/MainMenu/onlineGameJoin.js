import Phaser from 'phaser';

import { createMenu } from '../../utils/createMenu';
import { createImg } from '../../utils/createImg';

export default class MainMenuOnlineGame extends Phaser.Scene {
  constructor() {
    super('MainMenuOnlineGameJoin');
  }

  create() {
    createImg(this);
    this.client = this.game.client;
    this.client.on('requestGamesSuccess', (sessionNames) => {
      this.menuItems = {};
      sessionNames.forEach((sessionName) => {
        this.menuItems[sessionName] = () => this.joinGame(sessionName);
      });
      this.menuCallBack = () => {
        this.scene.stop();
        this.scene.switch('MainMenuOnlineGame');
      };
      if (!sessionNames.length) this.menuItems['No games hosted'] = this.menuCallBack;
      this.menu = createMenu(this, this.menuItems, true, this.menuCallBack);
    });
    this.client.on('gameReady', (sessionName) => {
      this.menu[0].item.setText(`${sessionName} ready!`);
      this.menu[0].item.off('pointerdown');
      this.menu[0].item.on('pointerdown', () => this.requestStartGame(sessionName));
      for (let itemIndex = 1; itemIndex < this.menu.length; itemIndex += 1) {
        if (this.menu[itemIndex].item) this.menu[itemIndex].item.destroy();
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
}
