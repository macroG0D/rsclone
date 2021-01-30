import Phaser from 'phaser';

import { CONTROL_KEYS_SEQUENCE } from '../constants';

export default class Gamepad extends Phaser.Events.EventEmitter {
  constructor(scene, controlScene, playerKey, position, config) {
    super();
    this.scene = scene;
    this.controlScene = controlScene;
    this.playerKey = playerKey;
    this.state = {};
    this.createGamepad(position, config);
  }

  createGamepad(position, config = '8dir') {
    const { scene } = this;
    const radius = 100;
    const padding = 50;
    const size = radius + padding;
    const x = (position === 1) ? size : scene.game.config.width - size;
    const y = scene.game.config.height - size;

    const mainColor = (position === 1) ? 0x23a645 : 0xde2e6b;
    const secondaryColor = (position === 1) ? 0xde2e6b : 0x23a645;

    const joystick = scene.plugins.get('rexVirtualJoystick').add(scene, {
      x,
      y,
      radius,
      base: scene.add.circle(0, 0, radius, mainColor),
      thumb: scene.add.circle(0, 0, radius / 2, secondaryColor),
      dir: config,
    });
    joystick.base.alpha = 0.75;
    joystick.base.setDepth(1);
    joystick.thumb.setDepth(2);
    this.joystick = joystick;
    joystick.on('update', this.onUpdate, this);
  }

  onUpdate() {
    CONTROL_KEYS_SEQUENCE.forEach((direction) => {
      const state = this.state[direction];
      const keyState = this.joystick[direction];
      if (keyState !== state) {
        this.setDirection(direction, keyState);
        this.state[direction] = keyState;
      }
    });
  }

  setDirection(direction, flag) {
    const { playerKey } = this;
    if (!this.controlScene.online) {
      this.controlScene.setDirection(playerKey, direction, flag);
      return;
    }
    this.controlScene.client.sendData('playerMove', {
      playerKey,
      direction,
      movementFlag: flag,
    });
  }
}
