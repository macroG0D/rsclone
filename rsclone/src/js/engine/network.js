import { THROTTLE_DELAY } from '../constants';

export default class Network {
  constructor(scene) {
    this.scene = scene;
    this.client = scene.client;
    this.initSync = this.initSync.bind(this);
    if (this.client) {
      this.client.on('newRecord', (data) => {
        this.scene.game.spawnPopup(this.scene, 'newRecord', data);
      });

      this.client.on('noRecord', (data) => {
        this.scene.game.spawnPopup(this.scene, 'noRecord', data);
      });
    }
  }

  initSync() {
    this.client.off('playerMove', this.onPlayerMove, this);
    this.client.on('playerMove', this.onPlayerMove, this);

    this.client.off('playerSync', this.onPlayerSync, this);
    this.client.on('playerSync', this.onPlayerSync, this);

    this.scene.events.off('update', this.sync, this);
    this.scene.events.on('update', this.sync, this);
  }

  onPlayerMove(data) {
    const { playerKey, direction, movementFlag } = data;
    this.scene.level.setDirection(playerKey, direction, movementFlag);
  }

  onPlayerSync(data) {
    const {
      playerKey,
      x,
      y,
      angle,
      disableGravitySwitch,
    } = data;
    const character = this.scene.level[playerKey];
    if (character) {
      if (character.x && character.x !== x) character.x = x;
      if (character.y && character.y !== y) character.y = y;
      if (character.angle && character.angle !== angle) character.angle = angle;
      if (character.disableGravitySwitch
            && character.disableGravitySwitch !== disableGravitySwitch) {
        character.disableGravitySwitch = disableGravitySwitch;
      }
    }
  }

  sync() {
    if (this.throttle) return;
    this.throttle = true;
    const { playerKey } = this.scene;
    const player = this.scene.level[this.scene.playerKey];
    if (player) {
      const playerData = {
        playerKey,
        x: player.x,
        y: player.y,
        angle: player.angle,
        disableGravitySwitch: player.disableGravitySwitch,
      };
      this.client.sendData('playerSync', playerData);
    }
    setTimeout(() => { this.throttle = false; }, THROTTLE_DELAY);
  }
}
