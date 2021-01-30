import Phaser from 'phaser';

import Score from '../components/score';

export default class Boot extends Phaser.Scene {
  constructor() {
    super('Score');
  }

  create(data) {
    const { parent, score, time } = data;
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
