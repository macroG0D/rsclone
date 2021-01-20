import Phaser from 'phaser';

import Menu from '../../components/menu';

export default class MainMenuLeaderBoard extends Phaser.Scene {
  constructor() {
    super('MainMenuLeaderBoard');
  }

  create() {
    const menuItems = {
      leaderboard: () => this.scene.switch('MainMenu'),
    };
    this.menu = new Menu(this, menuItems, true);
  }
}
