import Phaser from 'phaser';

import Client from '../utils/client';

export default class Game extends Phaser.Game {
  constructor(app, config) {
    super(config);
    this.client = new Client();

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
  }
}
