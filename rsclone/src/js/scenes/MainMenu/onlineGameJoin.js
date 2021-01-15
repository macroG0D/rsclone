import Phaser from 'phaser';

import { createMenu } from '../../utils/createMenu';
import { createBg } from '../../utils/createBg';

export default class MainMenuOnlineGame extends Phaser.Scene {
  constructor() {
    super('MainMenuOnlineGameJoin');
  }

  create() {
    createBg(this);
    this.createImg();
    this.client = this.game.client;
    this.client.on('joinGameSuccess', (sessionNames) => {
      this.menuItems = {};
      sessionNames.forEach((sessionName) => {
        this.menuItems[sessionName] = () => this.joinGame(sessionName);
      });
      this.menuCallBack = () => {
        this.scene.stop();
        this.scene.switch('MainMenuOnlineGame');
      };
      this.menu = createMenu(this, this.menuItems, true, this.menuCallBack);
    });
    this.requestJoinGame();
  }

  requestJoinGame() {
    this.client.sendData('requestJoinGame');
  }

  joinGame(sessionName) {
    this.client.sendData('joinGame', sessionName);
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
