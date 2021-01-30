import Create from './dom-create';
export default class Score extends Create {
  constructor(scene, score = 0, time = 0) {
    super('div');
    this.scene = scene;
    this.currentScore = score;
    this.currentTime = time;
    this.container = new Create('div', this.node, 'game-score');
    this.timeLabel = new Create('div', this.container.node, 'game-score-time-icon');
    this.timeValue = new Create('div', this.container.node, 'game-score-time', this.getTime());
    this.scoreLabel = new Create('div', this.container.node, 'game-score-score-icon');
    this.scoreValue = new Create('div', this.container.node, 'game-score-score', score);

    this.spawn = scene.add.dom(0, 0, this.node);
    this.spawn.setScrollFactor(0, 0);
    this.spawn.setOrigin(0);

    this.scene.parent.events.off('updateScore', this.updateScore, this);
    this.scene.parent.events.on('updateScore', this.updateScore, this);

    this.scene.time.addEvent({
      delay: 1000,
      callback: () => this.updateTime(),
      callbackScope: this,
      loop: true,
    });
  }

  getTime() {
    return new Date(this.currentTime).toISOString().substr(11, 8);
  }

  updateTime() {
    this.currentTime += 1000;
    const newTime = this.getTime();
    this.timeValue.node.innerHTML = newTime;
  }

  updateScore(score) {
    this.currentScore += score;
    this.scoreValue.node.innerHTML = this.currentScore;
  }
}
