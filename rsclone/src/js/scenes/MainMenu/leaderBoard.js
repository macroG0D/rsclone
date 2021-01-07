import Phaser from 'phaser';

import { createMenu } from '../../utils/createMenu';
import { createBg } from '../../utils/createBg';

export default class MainMenuLeaderBoard extends Phaser.Scene {
  constructor() {
    super('MainMenuLeaderBoard');
  }

  create() {
    this.menuItems = {
      'Leaderboard': () => this.scene.start('MainMenu'),
    };
    createBg(this);
    createMenu(this, this.menuItems, true);
  }
}