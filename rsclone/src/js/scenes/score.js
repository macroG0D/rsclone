import Phaser from 'phaser';
import EventsCenter from '../utils/eventsCenter';

export default class Score extends Phaser.Scene {
  constructor() {
    super('Score');
  }

  create() {
    this.currentScore = 0;
    this.currentTime = 0;
    this.addScore();
    this.addTimer();

    EventsCenter.on('update-score', this.updateScore, this);
  }

  addTimer() {
    const zeroAdd = (number) => {
      let res = String(number);
      while (res.length < 2) {
        res = `0${res}`;
      }
      return res;
    };

    const setTimerStyle = (timeInSeconds) => {
      const hours = Math.floor(timeInSeconds / 3600);
      const minutes = Math.floor(timeInSeconds / 60) % 60;
      const seconds = Math.floor(timeInSeconds) % 60;
      return `${zeroAdd(hours)} : ${zeroAdd(minutes)} : ${zeroAdd(seconds)}`;
    };
    this.timerText = this.add.text(10, 10, 'time: 00 : 00 : 00', {
      font: '20px Montserrat',
      fill: '#003554',
    }).setScrollFactor(0, 0).setOrigin(0);
    this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.currentTime += 1;
        this.timerText.setText(`time:  ${setTimerStyle(this.currentTime)}`);
      },
      callbackScope: this,
      loop: true,
    });
  }

  addScore() {
    this.scoreText = this.add.text(10, 35, '', {
      font: '20px Montserrat',
      fill: '#003554',
    }).setScrollFactor(0, 0).setOrigin(0);

    this.scoreText.setText(`score:  ${this.currentScore}`);
  }

  updateScore(score) {
    this.currentScore += score;
    this.scoreText.setText(`score:  ${this.currentScore}`);
  }
}
