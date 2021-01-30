import Phaser from 'phaser';

import Input from '../engine/input';
import Gamepad from '../engine/gamepad';

import Score from '../components/score';

import { PLAYER_1_CONTROLS, PLAYER_2_CONTROLS } from '../constants';

export default class gameUI extends Phaser.Scene {
  constructor() {
    super('gameUI');
  }

  create(gameData) {
    const {
      parent,
      online,
      master,
      score,
      time,
    } = gameData;
    this.parent = parent;

    parent.events.off('pause', this.onPause, this);
    parent.events.on('pause', this.onPause, this);

    parent.events.off('sleep', this.onSleep, this);
    parent.events.on('sleep', this.onSleep, this);

    parent.events.off('resume', this.onResume, this);
    parent.events.on('resume', this.onResume, this);

    parent.events.off('wake', this.onWake, this);
    parent.events.on('wake', this.onWake, this);

    parent.events.off('shutdown', this.onShutdown, this);
    parent.events.on('shutdown', this.onShutdown, this);

    this.score = new Score(this, score, time);
    this.game.score = this.score;

    if (online) {
      const playerKey = (master) ? 'ibb' : 'obb';
      parent.online = true;
      parent.playerKey = playerKey;
      this.player1Input = new Input(parent, playerKey, PLAYER_1_CONTROLS);
      parent.network.initSync();
    } else {
      this.player1Input = new Input(parent, 'ibb', PLAYER_1_CONTROLS);
      this.player2Input = new Input(parent, 'obb', PLAYER_2_CONTROLS);
      this.player1Gamepad = new Gamepad(this, parent, 'ibb', 1);
      this.player2Gamepad = new Gamepad(this, parent, 'obb', 2);
    }
  }

  onPause() {
    this.scene.pause();
  }

  onSleep() {
    this.scene.sleep();
  }

  onResume() {
    this.scene.resume();
  }

  onWake() {
    this.scene.wake();
  }

  onShutdown() {
    this.scene.stop();
  }
}
