import Phaser from 'phaser';

import { createBg } from '../../utils/createBg';

export default class GameOver extends Phaser.Scene {
  constructor() {
    super('GameOver');
  }

  create() {
    const { level } = this.game;
    const levelName = `Level${level}`;
    createBg(this, 0x000000);
    const { centerX, centerY } = this.cameras.main;
    this.add.text(centerX, centerY, `lvl ${level}`, {
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
