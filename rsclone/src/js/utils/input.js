import Phaser from 'phaser';

import { CONTROL_KEYS_SEQUENCE } from '../constants';

export default class Input extends Phaser.Events.EventEmitter {
  constructor(scene, playerKey, controls) {
    super();
    this.scene = scene;
    this.controls = {};
    controls.forEach((controlKey, controlIndex) => {
      const direction = CONTROL_KEYS_SEQUENCE[controlIndex];
      this.controls[direction] = this.scene
        .input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[controlKey], true, true);

      this.controls[direction].on('down', () => {
        this.scene.setDirection(playerKey, direction, true);
      });

      this.controls[direction].on('up', () => {
        this.scene.setDirection(playerKey, direction, false);
      });
    });
  }
}
