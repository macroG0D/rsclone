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
    this.game.app.settings.level = nextLevel;
    const levelName = (nextLevel < 3) ? `Level${nextLevel}` : 'THE END';
    createBg(this, 0x000000);
    const { centerX, centerY } = this.cameras.main;
    this.titleText = this.add.text(centerX, centerY, levelName, {
      font: '65px Montserrat',
      fill: '#E5E5E5',
      align: 'center',
    }).setOrigin(0.5);

    let callback = () => this.scene.start(levelName, gameData);
    if (nextLevel >= 3) callback = () => this.client.sendData('checkScore', gameData);

    this.time.addEvent({
      delay: 2500,
      callback,
    });
  }
}
