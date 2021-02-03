import Phaser from 'phaser';
import Enemy from '../enemy';

export default class JumpingHedgehog extends Enemy {
  constructor(scene, x, y, spriteA, spriteB,
    isUpsideDown = false, offsetBetweenHeadAndButt = 100,
    buttX = 0, reverseGravity = isUpsideDown) {
    super(scene, x, y, spriteA);
    this.name = 'JumpingHedgehog';
    this.isUpsideDown = isUpsideDown;
    this.reverseGravity = reverseGravity;
    this.offsetBetweenHeadAndButt = this.isUpsideDown
      ? offsetBetweenHeadAndButt * -1 : offsetBetweenHeadAndButt;
    this.butt = scene.add.sprite(x + buttX, y + this.offsetBetweenHeadAndButt, spriteB);
    this.buttSensor = scene.matter.add.gameObject(
      this.butt,
      {
        shape: { type: 'circle', radius: 40 },
        ignoreGravity: true,
        isSensor: true,
      },
    )
      .setFriction(0)
      .setFrictionAir(0)
      .setBounce(0);

    this.setSensors(x, y);
    this.butt.angle = this.isUpsideDown ? 180 : 0;
    this.angle = this.isUpsideDown ? 180 : 0;

    this.scene.events.on('update', this.update, this);
  }

  setSensors(x, y) {
    this.Body = Phaser.Physics.Matter.Matter.Body;
    this.Bodies = Phaser.Physics.Matter.Matter.Bodies;
    this.sensors = {
      top: this.Bodies.circle(0, 40, 40, {
        isSensor: true,
      }),
    };
    const compoundBody = this.Body.create({
      parts: [
        this.sensors.top,
      ],
      ignoreGravity: true,
    });
    this
      .setExistingBody(compoundBody)
      .setFixedRotation() // disable spin around its mass center point
      .setPosition(x, y);
    this.scene.add.existing(this);
    this.scene.matterCollision.addOnCollideStart({
      objectA: [this.sensors.top],
      callback: this.killPlayer,
      context: this,
    });
    this.scene.matterCollision.addOnCollideStart({
      objectA: [this.buttSensor],
      callback: this.gotKilled,
      context: this,
    });
  }
}
