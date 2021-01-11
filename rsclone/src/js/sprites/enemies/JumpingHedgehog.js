import Phaser from 'phaser';
import Enemy from '../Enemy';

export default class JumpingHadgehog extends Enemy {
  constructor(scene, x, y, spriteA, spriteB, offsetBetweenHeadAndButt) {
    super(scene, x, y, spriteA);
    this.name = 'JumpingHadgehog';
    this.offsetBetweenHeadAndButt = offsetBetweenHeadAndButt;
    this.butt = scene.add.sprite(x, y, spriteB);
    this.setSensors(x, 600);
    this.scene.events.on('update', this.update, this);
  }

  setSensors(x, y) {
    this.Body = Phaser.Physics.Matter.Matter.Body;
    this.Bodies = Phaser.Physics.Matter.Matter.Bodies;
    this.sensors = {
      top: this.Bodies.circle(0, -this.height, 40, {
        isSensor: true,
      }),
      bottom: this.Bodies.circle(0, this.height, 40, {
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
    // eslint-disable-next-line no-underscore-dangle
    this._displayOriginX = this.width / 2;
    // eslint-disable-next-line no-underscore-dangle
    this._displayOriginY = (this.height * 2 + this.offsetBetweenHeadAndButt) / 2;
    this.originX = this.width / 2;
    this.OriginY = this.height * 2 + this.offsetBetweenHeadAndButt;
    console.log(this.OriginY);
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
        const dy = y - this.y;
        this.y = y;
        this.butt.y = buttY + this.offsetBetweenHeadAndButt;
        this.sensors.bottom.position.y = this.butt.y;
        this.setVelocityY(dy);
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
