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
        if (!this.scene.online) {
          this.scene.setDirection(playerKey, direction, true);
          return;
        }
        this.scene.client.sendData('playerMove', {
          playerKey,
          direction,
          movementFlag: true,
        });
      });

      this.controls[direction].on('up', () => {
        if (!this.scene.online) {
          this.scene.setDirection(playerKey, direction, false);
          return;
        }
        this.scene.client.sendData('playerMove', {
          playerKey,
          direction,
          movementFlag: false,
        });
      });
    });
  }
}
