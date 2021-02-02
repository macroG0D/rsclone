import Phaser from 'phaser';

import { createBg } from '../utils/createBg';

import { LOCALE } from '../locale';

export default class LevelSwitch extends Phaser.Scene {
  constructor() {
    super('LevelSwitch');
  }

  create(gameData) {
    const locale = LOCALE[this.game.app.settings.locale];
    this.client = this.game.client;
    const currLevel = this.game.level;
    const nextLevel = currLevel + 1;
    this.game.level = nextLevel;
    const levelText = locale.level || 'level';
    createBg(this, 0xE5E5E5);
    const { centerX, centerY } = this.cameras.main;
    this.titleText = this.add.text(centerX, centerY, levelText, {
      font: '45px Montserrat',
      fill: '#000000',
      align: 'center',
    }).setOrigin(0.5);

    const callback = () => {
      this.game.app.settings.level = nextLevel;
      this.game.app.settings.score = gameData.score || 0;
      this.game.app.settings.time = gameData.time || 0;
      this.game.app.saveSettings();
      this.scene.start(`Level${nextLevel}`, gameData);
    };

    this.time.addEvent({
      delay: 2500,
      callback,
    });
  }
}
