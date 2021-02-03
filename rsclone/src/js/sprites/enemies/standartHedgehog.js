import Phaser from 'phaser';
import Enemy from '../enemy';

export default class StandartHedgehog extends Enemy {
  constructor(scene, x, y, spriteA, spriteB, isUpsideDown = false,
    offsetBetweenHeadAndButt = 58, reverseGravity = isUpsideDown) {
    super(scene, x, y, spriteA);
    this.name = 'StandartHedgehog';
    this.reverseGravity = reverseGravity;
    this.isUpsideDown = isUpsideDown;
    this.offsetBetweenHeadAndButt = this.isUpsideDown
      ? offsetBetweenHeadAndButt * -1 : offsetBetweenHeadAndButt;
    this.butt = scene.add.sprite(x, y + this.offsetBetweenHeadAndButt, spriteB);
    this.setSensors(x, y, 28, 28);
    this.butt.angle = this.isUpsideDown ? 180 : 0;
    this.angle = this.isUpsideDown ? 180 : 0;
  }

  setSensors(x, y, partsPositionA = 28, partsPositionB = 28) {
    this.Body = Phaser.Physics.Matter.Matter.Body;
    this.Bodies = Phaser.Physics.Matter.Matter.Bodies;
    this.sensors = {
      top: this.Bodies.circle(0, 0, 40, {
        isSensor: true,
      }),
      bottom: this.Bodies.circle(0, 16, 40, {
        isSensor: true,
      }),
    };
    const compoundBody = this.Body.create({
      parts: [
        this.sensors.top,
        this.sensors.bottom,
      ],
      ignoreGravity: true,
    });
    this
      .setExistingBody(compoundBody)
      .setFixedRotation() // disable spin around its mass center point
      .setPosition(x, y);
    this.scene.add.existing(this);

    this.body.parts[1].position.y += partsPositionA;
    this.body.parts[2].position.y += partsPositionB;

    this.scene.matterCollision.addOnCollideStart({
      objectA: [this.sensors.top],
      callback: this.killPlayer,
      context: this,
    });
    this.scene.matterCollision.addOnCollideStart({
      objectA: [this.sensors.bottom],
      callback: this.gotKilled,
      context: this,
    });
  }
}
