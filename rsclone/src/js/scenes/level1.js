import Phaser from 'phaser';

import Level from '../engine/level';
import Network from '../engine/network';
import { playMusic } from '../utils/playMusic';

export default class Level1 extends Phaser.Scene {
  constructor() {
    super('Level1');
  }

  create(data) {
    console.log('create!');
    this.level = new Level(this);
    this.level.postInit();

    playMusic(this);

    this.client = this.game.client;
    this.network = new Network(this);
    const gameData = data || {};
    gameData.parent = this;
    this.scene.run('gameUI', gameData);
  }
}
