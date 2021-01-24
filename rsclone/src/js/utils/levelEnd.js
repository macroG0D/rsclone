import Phaser from 'phaser';

export default class LevelEnd extends Phaser.GameObjects.Rectangle {
  constructor(scene, x, y, width = 150, height = 150) {
    super(scene, x - width / 2, y + height / 2, width, height);
    this.scene = scene;
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
    const score = this.scene.score.currentScore;
    const time = this.scene.score.currentTime;
    const nextLevelNumber = +(this.scene.scene.key.slice(-1)) + 1;
    const nextLevel = `Level${nextLevelNumber}`;
    const gameData = { score, time, nextLevel };
    this.scene.scene.start('LevelSwitch', gameData);
  }
}
