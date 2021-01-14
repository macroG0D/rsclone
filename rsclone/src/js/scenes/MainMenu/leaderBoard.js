import Phaser from 'phaser';

import { createMenu } from '../../utils/createMenu';
import { createBg } from '../../utils/createBg';

export default class MainMenuLeaderBoard extends Phaser.Scene {
  constructor() {
    super('MainMenuLeaderBoard');
  }

  create() {
    this.menuItems = {
      Leaderboard: () => this.scene.switch('MainMenu'),
    };
    createBg(this);
    createMenu(this, this.menuItems, true);
    window.location.hash = this.scene.key;
  }
}
