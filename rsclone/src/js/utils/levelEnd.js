import Phaser from 'phaser';

export default class LevelEnd extends Phaser.GameObjects.Rectangle {
  constructor(scene, x, y, width = 100, height = 150) {
    super(scene, x - width / 2, y + height / 2, width, height);
    const { ibb, obb } = scene;
    this.scene = scene;
    const matterParams = {
      isSensor: true,
      isStatic: true,
    };
    scene.matter.add.gameObject(this, matterParams);
    this.initPlayersFinishCollide([ibb, obb]);
  }

  initPlayersFinishCollide(players) {
    this.scene.matterCollision.addOnCollideStart({
      objectA: players,
      objectB: this,
      callback: ({ gameObjectA }) => gameObjectA.toggleFinishState(),
      context: this,
    });
    this.scene.matterCollision.addOnCollideEnd({
      objectA: players,
      objectB: this,
      callback: ({ gameObjectA }) => gameObjectA.toggleFinishState(),
      context: this,
    });
  }

  completeLevel() {
    window.main.startNextLevel(this.scene);
  }
}
