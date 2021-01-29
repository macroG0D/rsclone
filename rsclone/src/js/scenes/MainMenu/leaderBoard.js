import Phaser from 'phaser';

import LeaderBoard from '../../components/leaderBoard';

import { localization } from '../../engine/localization';

export default class MainMenuLeaderBoard extends Phaser.Scene {
  constructor() {
    super('MainMenuLeaderBoard');
  }

  create(gameData) {
    const { id } = gameData;
    this.board = new LeaderBoard(this, id);
    this.client = this.game.client;
    if (this.client) {
      this.client.off('getScore');
      this.client.on('getScore', (data) => {
        this.board.updateTable(data);
      });
      this.client.sendData('getScore');
    }
  }

  update() {
    localization(this);
  }
}
