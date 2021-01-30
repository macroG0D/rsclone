import Phaser from 'phaser';

import { CONTROL_KEYS_SEQUENCE } from '../constants';

export default class Gamepad extends Phaser.Events.EventEmitter {
  constructor(scene, playerKey, position, config) {
    super();
    this.scene = scene;
    this.playerKey = playerKey;
    this.createGamepad(position, config);
  }

  createGamepad(position, config = '4dir') {
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
    joystick.on('update', this.joystickOnUpdate, this);
    this.joystick = joystick;
  }

  joystickOnUpdate() {
    let empty = true;
    CONTROL_KEYS_SEQUENCE.forEach((direction) => {
      const joyDirection = this.joystick[direction];
      if (joyDirection && (joyDirection || this.prevDirection)) {
        this.changeDirection(direction);
        empty = false;
      }
    });

    const { playerKey, prevDirection } = this;
    if (empty && prevDirection) {
      this.stopDirection(playerKey, prevDirection);
      this.prevDirection = false;
    }
  }

  changeDirection(direction) {
    const { playerKey, prevDirection } = this;
    if (prevDirection) this.stopDirection(playerKey, prevDirection);
    this.startDirection(playerKey, direction);
    this.prevDirection = direction;
  }

  startDirection(playerKey, direction) {
    if (!this.scene.online) {
      this.scene.setDirection(playerKey, direction, true);
      return;
    }
    this.scene.client.sendData('playerMove', {
      playerKey,
      direction,
      movementFlag: true,
    });
  }

  stopDirection(playerKey, direction) {
    if (!this.scene.online) {
      this.scene.setDirection(playerKey, direction, false);
      return;
    }
    this.scene.client.sendData('playerMove', {
      playerKey,
      direction,
      movementFlag: false,
    });
  }
}
