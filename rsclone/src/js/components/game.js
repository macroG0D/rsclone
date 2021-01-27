import Phaser from 'phaser';

import Client from '../engine/client';

export default class Game extends Phaser.Game {
  constructor(app, config) {
    super(config);
    this.client = new Client();
    this.client.socket.open();

    this.music = {
      current: undefined,
      cache: {},
    };

    this.sounds = {
      volume: {},
      cache: {},
      walk: {
        ibb: {},
        obb: {},
      },
    };

    this.app = app; // link to main class
    this.level = this.app.settings.level;
  }
}
