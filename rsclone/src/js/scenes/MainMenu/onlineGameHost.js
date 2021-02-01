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
    const menuItems = {
      'Retrieving game name...': '',
    };
    const menuCallBack = () => {
      this.colyseus.leaveGameRoom();
      this.scene.start('MainMenuOnlineGame');
    };
    this.menu = new Menu(this, menuItems, true, menuCallBack);

    this.colyseus.once('getRoom', this.onGetRoom, this);
    this.colyseus.once('joinRoom', this.onJoinRoom, this);
    this.colyseus.once('startGame', this.onStartGame, this);
    this.colyseus.relaySend('getRoom');
  }

  onGetRoom(name) {
    if (this.menu) {
      if (name !== 'no rooms') {
        this.menu.items[0].node.innerHTML = `Joining #${name} room...`;
        this.colyseus.joinGameRoom(name);
        return;
      }
      this.menu.items[0].node.innerHTML = 'No free rooms...';
    }
  }

  onJoinRoom(name) {
    if (this.menu) {
      if (name) {
        this.menu.items[0].node.innerHTML = `Room #${name} ready!`;
        return;
      }
      this.menu.items[0].node.innerHTML = 'No free rooms...';
    }
  }

  onStartGame() {
    this.scene.start('Level1', { online: true, master: true });
  }

  update() {
    localization(this);
  }
}
