import Phaser from 'phaser';

export default class LevelEnd extends Phaser.GameObjects.Rectangle {
  constructor(scene, x, y, width = 150, height = 150) {
    super(scene, x - width / 2, y + height / 2, width, height);
    this.scene = scene;
    const { ibb, obb } = scene.level;
    const matterParams = {
      isSensor: true,
      isStatic: true,
    };
    scene.matter.add.gameObject(this, matterParams);
    this.addPointlight(x, y, width, height);
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
    const score = this.scene.game.score.currentScore;
    const time = this.scene.game.score.currentTime;
    const gameData = { score, time };
    this.scene.scene.start('LevelSwitch', gameData);
  }

  addPointlight(x, y, width, height) {
    const margin = 10;
    const color = Phaser.Display.Color.IntegerToRGB(0xddddff);
    const light = this.scene.add.pointlight(
      x - margin, y + (height / 2),
      margin, width * 2, 1,
    );
    light.depth = 100;
    light.color.setTo(color.r, color.g, color.b);
  }
}
