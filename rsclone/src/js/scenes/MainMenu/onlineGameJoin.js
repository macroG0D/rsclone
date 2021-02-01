import Phaser from 'phaser';

import Menu from '../../components/menu';
import { createImg } from '../../utils/createImg';

import { localization } from '../../engine/localization';

export default class MainMenuOnlineGame extends Phaser.Scene {
  constructor() {
    super('MainMenuOnlineGameJoin');
  }

  create() {
    this.colyseus = this.game.colyseus;
    createImg(this);
    const menuItems = {
      'Looking for a partner...': '',
    };
    const menuCallBack = () => {
      this.colyseus.leaveGameRoom();
      this.scene.start('MainMenuOnlineGame');
    };
    this.menuCallBack = menuCallBack;
    this.menu = new Menu(this, menuItems, true, menuCallBack);
    this.colyseus.once('getRooms', this.onGetRooms, this);
    this.colyseus.once('joinRoom', this.onJoinRoom, this);
    this.colyseus.once('startGame', this.onStartGame, this);
    this.colyseus.relaySend('getRooms');
  }

  onGetRooms(rooms) {
    if (this.menu) {
      if (rooms && rooms.length) {
        this.menu.spawn.destroy();
        const menuItems = {};
        rooms.forEach((room) => {
          menuItems[room] = () => this.colyseus.joinGameRoom(room);
        });
        this.menu = new Menu(this, menuItems, true, this.menuCallBack);
        return;
      }
      if (!rooms || !rooms.length) this.menu.items[0].node.innerHTML = 'No rooms found...';
    }
  }

  onJoinRoom(name) {
    if (this.menu) {
      this.menu.spawn.destroy();
      const menuText = (name) ? `Room #${name} ready!` : 'No free rooms...';
      const menuItems = {};
      menuItems[menuText] = '';
      this.menu = new Menu(this, menuItems, true, this.menuCallBack);
    }
  }

  onStartGame() {
    this.scene.start('Level1', { online: true, master: false });
  }

  update() {
    localization(this);
  }
}
