import Phaser from 'phaser';

export default class Portal extends Phaser.GameObjects.Rectangle {
  constructor(scene, x, y, width, height, color, objSettings) {
    super(scene, x, y, width, height, color); // new Rectangle()
    scene.matter.add.gameObject(this, objSettings);
  }
}
