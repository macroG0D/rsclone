import Phaser from 'phaser';

import Menu from '../../components/menu';

import { localization } from '../../engine/localization';

export default class MainMenuLeaderBoard extends Phaser.Scene {
  constructor() {
    super('MainMenuLeaderBoard');
  }

  create() {
    const menuItems = {
      leaderboard: '',
    };
    this.menu = new Menu(this, menuItems, true);
  }

  update() {
    localization(this);
  }
}
