import Phaser from 'phaser';

import { createBg } from '../utils/createBg';

export default class LevelSwitch extends Phaser.Scene {
  constructor() {
    super('LevelSwitch');
  }

  create(gameData) {
    this.client = this.game.client;
    const currLevel = this.game.level;
    const nextLevel = currLevel + 1;
    this.game.level = nextLevel;
    const levelName = (nextLevel < 3) ? `Level${nextLevel}` : 'THE END';
    createBg(this, 0x000000);
    const { centerX, centerY } = this.cameras.main;
    this.titleText = this.add.text(centerX, centerY, levelName, {
      font: '65px Montserrat',
      fill: '#E5E5E5',
      align: 'center',
    }).setOrigin(0.5);

    let callback = () => {
      this.game.app.settings.level = nextLevel;
      this.game.app.settings.score = gameData.score || 0;
      this.game.app.settings.time = gameData.score || 0;
      this.scene.start(levelName, gameData);
    };
    if (nextLevel >= 3) {
      callback = () => {
        this.game.app.settings.level = 1;
        this.game.app.settings.score = 0;
        this.game.app.settings.time = 0;
        this.scene.stop();
        this.client.sendData('checkScore', gameData);
      };
    }

    this.time.addEvent({
      delay: 2500,
      callback,
    });
  }
}
