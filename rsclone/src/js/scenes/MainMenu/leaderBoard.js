import Phaser from 'phaser';

import { createMenu } from '../../utils/createMenu';

export default class MainMenuLeaderBoard extends Phaser.Scene {
  constructor() {
    super('MainMenuLeaderBoard');
  }

  create() {
    this.menuItems = {
      leaderboard: () => this.scene.switch('MainMenu'),
    };
    createMenu(this, this.menuItems, true);
  }
}
