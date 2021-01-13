import Phaser from 'phaser';
import Enemy from '../enemy';

export default class JumpingHedgehog extends Enemy {
  constructor(scene, x, y, spriteA, spriteB, offsetBetweenHeadAndButt) {
    super(scene, x, y, spriteA);
    this.name = 'JumpingHedgehog';
    this.offsetBetweenHeadAndButt = offsetBetweenHeadAndButt;
    this.butt = scene.add.sprite(x, y + offsetBetweenHeadAndButt, spriteB);
    this.buttSensor = scene.matter.add.gameObject(this.butt, { shape: { type: 'circle', radius: 40 } }).setFriction(0).setFrictionAir(0).setBounce(0);
    this.setSensors(x, y);
    this.scene.events.on('update', this.update, this);
  }

  setSensors(x, y) {
    this.Body = Phaser.Physics.Matter.Matter.Body;
    this.Bodies = Phaser.Physics.Matter.Matter.Bodies;
    this.sensors = {
      top: this.Bodies.circle(0, 40, 40, {
        isSensor: true,
      }),
      /*
      bottom: this.Bodies.circle(0, this.height / 2, 40, {
        isSensor: true,
      }),
      */
    };
    const compoundBody = this.Body.create({
      parts: [
        this.sensors.top,
        // this.sensors.bottom,
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

  jump(length, speedMS) {
    this.scene.tweens.addCounter({
      from: 0,
      to: -`${length}`,
      duration: speedMS,
      ease: Phaser.Math.Easing.Sine.InOut,
      repeat: -1,
      yoyo: true,
      onUpdate: (tween, target) => {
        if (!this.isAlive) {
          this.body.destroy();
          this.butt.destroy();
          return;
        }
        const y = this.startY + target.value;
        const buttY = this.startY - target.value;
        this.y = y;
        this.butt.y = buttY + this.offsetBetweenHeadAndButt;
        // this.sensors.bottom.position.y = this.butt.y;
        if (this.y === this.startY) {
          this.setFlipY(false);
        }
      },
      onYoyo: () => {
        this.setFlipY(true);
      },
    });
  }
}
