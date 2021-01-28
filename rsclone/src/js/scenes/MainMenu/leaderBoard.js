import Phaser from 'phaser';

import LeaderBoard from '../../components/leaderBoard';

import { localization } from '../../engine/localization';

export default class MainMenuLeaderBoard extends Phaser.Scene {
  constructor() {
    super('MainMenuLeaderBoard');
  }

  create() {
    this.table = new LeaderBoard(this);
    this.client = this.game.client;
    if (this.client) {
      this.client.on('getScore', (data) => {
        this.table.updateTable(data);
      });
      this.client.sendData('getScore');
    }
  }

  update() {
    localization(this);
  }
}
