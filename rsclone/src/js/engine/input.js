import Phaser from 'phaser';

import { CONTROL_KEYS_SEQUENCE } from '../constants';

export default class Input extends Phaser.Events.EventEmitter {
  constructor(scene, playerKey, controls) {
    super();
    this.scene = scene;
    this.playerKey = playerKey;
    this.controls = {};
    this.state = {};
    controls.forEach((controlKey, controlIndex) => {
      const direction = CONTROL_KEYS_SEQUENCE[controlIndex];
      this.controls[direction] = this.scene
        .input.keyboard
        .addKey(Phaser.Input.Keyboard.KeyCodes[controlKey], true, false);
    });
    scene.events.off('update', this.onUpdate, this);
    scene.events.on('update', this.onUpdate, this);
  }

  onUpdate() {
    CONTROL_KEYS_SEQUENCE.forEach((direction) => {
      const state = this.state[direction];
      const keyState = this.controls[direction].isDown;
      if (keyState !== state) {
        this.setDirection(direction, keyState);
        this.state[direction] = keyState;
      }
    });
  }

  setDirection(direction, flag) {
    const { playerKey } = this;
    if (!this.scene.online) {
      this.scene.level.setDirection(playerKey, direction, flag);
      return;
    }
    this.scene.game.colyseus.roomSend('playerMove', this.state);
  }
}
