import { THROTTLE_DELAY } from '../constants';

export default class Network {
  constructor(scene) {
    this.scene = scene;
    this.client = scene.client;
    if (scene.online) {
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

      this.scene.events.off('update', this.sync, this);
      this.scene.events.on('update', this.sync, this);
    }

    if (this.client) {
      this.client.on('newRecord', (data) => {
        this.scene.game.spawnPopup(this.scene, 'newRecord', data);
      });

      this.client.on('noRecord', (data) => {
        this.scene.game.spawnPopup(this.scene, 'noRecord', data);
      });

      this.scene.input.keyboard.addKey('Q').on('up', () => {
        this.scene.events.emit('updateScore', 100);
      });

      this.scene.input.keyboard.addKey('E').on('up', () => {
        const score = this.scene.score.currentScore;
        const time = this.scene.score.currentTime;
        this.scene.events.emit('gameEnd', { score, time });
      });

      this.scene.events.on('gameEnd', (data) => {
        this.client.sendData('checkScore', data);
      });
    }
  }

  sync() {
    if (this.throttle) return;
    this.throttle = true;
    const { playerKey } = this.scene;
    const player = this.scene[this.scene.playerKey];
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
