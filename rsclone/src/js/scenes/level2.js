import Phaser from 'phaser';

import Level from '../engine/level';
import Network from '../engine/network';

export default class Level1 extends Phaser.Scene {
  constructor() {
    super('Level2');
    this.wallsColor = 0xffffff;
  }

  create(data) {
    this.level = new Level(this, this.wallsColor);
    this.level.postInit();

    this.client = this.game.client;
    this.network = new Network(this);
    const gameData = data || {};
    gameData.parent = this;
    this.scene.run('gameUI', gameData);
  }

  update() {
    if (this.scene.key !== this.game.music.key) this.game.music.play(this);
  }
}
