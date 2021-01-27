import Phaser from 'phaser';

import { THROTTLE_DELAY } from '../constants';

export default class Network extends Phaser.Events.EventEmitter {
  constructor(scene) {
    super();
    this.scene = scene;
    this.client = scene.client;
    if (scene.client) {
      scene.client.on('playerMove', (data) => {
        const { playerKey, direction, movementFlag } = data;
        scene.setDirection(playerKey, direction, movementFlag);
      });

      scene.client.on('playerSync', (data) => {
        const {
          playerKey,
          x,
          y,
          angle,
          disableGravitySwitch,
        } = data;
        const character = this.scene[playerKey];
        if (character) {
          if (character.x && character.x !== x) character.x = x;
          if (character.y && character.y !== y) character.y = y;
          if (character.angle && character.angle !== angle) character.angle = angle;
          if (character.disableGravitySwitch
                && character.disableGravitySwitch !== disableGravitySwitch) {
            character.disableGravitySwitch = disableGravitySwitch;
          }
        }
      });
    }
  }

  sync() {
    if (this.throttle) return;
    this.throttle = true;
    const character = this.scene[this.scene.playerKey];
    if (character) this.sendData(this.scene.playerKey, character);
    setTimeout(() => { this.throttle = false; }, THROTTLE_DELAY);
  }

  sendData(playerKey, player) {
    this.client.sendData('playerSync', {
      playerKey,
      x: player.x,
      y: player.y,
      angle: player.angle,
      disableGravitySwitch: player.disableGravitySwitch,
    });
  }
}
