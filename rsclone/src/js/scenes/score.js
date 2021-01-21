import Phaser from 'phaser';
import EventsCenter from '../utils/eventsCenter';
import Create from '../components/dom-create';

import { LOCALE } from '../locale';

import { localization } from '../utils/localization';

export default class Score extends Phaser.Scene {
  constructor() {
    super('Score');
  }

  create() {
    this.currentTime = 0;
    this.currentScore = 0;

    const locale = LOCALE[this.game.app.settings.locale];
    const timeText = locale.time || 'time';
    const scoreText = locale.score || 'score';

    this.board = new Create('div');
    this.container = new Create('div', this.board.node, 'game-score');
    this.timeLabel = new Create('div', this.container.node, 'game-score-time-label', timeText);
    this.timeValue = new Create('div', this.container.node, 'game-score-time', this.getTime());
    this.scoreLabel = new Create('div', this.container.node, 'game-score-score-label', scoreText);
    this.scoreValue = new Create('div', this.container.node, 'game-score-score', '0');
    this.board.spawn = this.add.dom(0, 0, this.board.node);
    this.board.spawn.setScrollFactor(0, 0);
    this.board.spawn.setOrigin(0);

    EventsCenter.on('update-score', this.updateScore, this);

    this.time.addEvent({
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
    localization(this);
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
