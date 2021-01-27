import Phaser from 'phaser';

export default class Network extends Phaser.Events.EventEmitter {
  constructor(scene) {
    super();
    this.scene = scene;
  }
}
