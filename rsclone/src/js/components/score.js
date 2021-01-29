import Create from './dom-create';

import { LOCALE } from '../locale';

import { localization } from '../engine/localization';

export default class Score extends Create {
  constructor(scene, score = 0, time = 0) {
    super('div');
    this.scene = scene;
    this.currentScore = score;
    this.currentTime = time;
    const locale = LOCALE[scene.game.app.settings.locale];
    const timeText = locale.time || 'time';
    const scoreText = locale.score || 'score';
    this.container = new Create('div', this.node, 'game-score');
    this.timeLabel = new Create('div', this.container.node, 'game-score-time-label', timeText);
    this.timeValue = new Create('div', this.container.node, 'game-score-time', this.getTime());
    this.scoreLabel = new Create('div', this.container.node, 'game-score-score-label', scoreText);
    this.scoreValue = new Create('div', this.container.node, 'game-score-score', '0');

    this.spawn = scene.add.dom(0, 0, this.node);
    this.spawn.setScrollFactor(0, 0);
    this.spawn.setOrigin(0);

    this.scene.parent.events.off('updateScore', this.updateScore, this);
    this.scene.parent.events.on('updateScore', this.updateScore, this);
    this.scene.parent.events.off('update', this.update, this);
    this.scene.parent.events.on('update', this.update, this);

    this.scene.time.addEvent({
      delay: 1000,
      callback: () => {
        this.currentTime += 1000;
      },
      callbackScope: this,
      loop: true,
    });
  }

  update() {
    this.updateTime();
    localization(this.scene);
  }

  getTime() {
    return new Date(this.currentTime).toISOString().substr(11, 8);
  }

  updateTime() {
    this.timeValue.node.innerHTML = this.getTime();
  }

  updateScore(score) {
    this.currentScore += score;
    this.scoreValue.node.innerHTML = this.currentScore;
  }
}
