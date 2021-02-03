import Phaser from 'phaser';

import { createBg } from '../../utils/createBg';

import { LOCALE } from '../../locale';

export default class GameOver extends Phaser.Scene {
  constructor() {
    super('GameOver');
  }

  create() {
    const { level } = this.game;
    const locale = LOCALE[this.game.app.settings.locale];
    const levelName = `Level${level}`;
    createBg(this, 0x000000);
    const { centerX, centerY } = this.cameras.main;
    const levelText = locale.level || 'level';
    this.add.text(centerX, centerY, `${levelText} ${level}`, {
      font: '45px Montserrat',
      fill: '#E5E5E5',
      align: 'center',
    }).setOrigin(0.5);

    this.time.addEvent({
      delay: 2500,
      callback: () => {
        this.scene.start(levelName);
      },
    });
  }
}
