import Phaser from 'phaser';

export default class MovingPlatform extends Phaser.Physics.Matter.Sprite {
  constructor(scene, x, y, sprite, distance, direction, speed = 10000) {
    super(scene.matter.world, x, y, sprite);
    this.isMoving = false;
    this.direction = direction;
    this.distance = distance;
    this.speed = speed;
    scene.add.existing(this);
    this.setFriction(1, 0, Infinity);
    this.startY = y;
    this.startX = x;
    const { Body, Bodies } = Phaser.Physics.Matter.Matter;
    const { width: w, height: h } = this;
    const mainBody = Bodies.rectangle(0, 0, w, h * 0.5, { chamfer: { radius: 8 } });
    this.sensors = {
      top: Bodies.rectangle(0, h - h * 1.2, w, 5, { isSensor: true }),
      bottom: Bodies.rectangle(0, h * 0.2, w, 5, { isSensor: true }),
    };
    const compoundBody = Body.create({
      parts: [
        mainBody,
        this.sensors.top,
        this.sensors.bottom,
      ],
      ignoreGravity: true,
    });

    this
      .setExistingBody(compoundBody)
      .setFixedRotation() // disable spin around its mass center point
      .setPosition(x, y);

    this.body.isStatic = true;
    this.scene.matterCollision.addOnCollideEnd({
      objectA: [this.sensors.top],
      callback: this.direction === 'horizontal' ? this.moveHorizontally : this.moveVertically,
      context: this,
    });
  }

  moveVertically() {
    if (!this.isMoving) {
      this.isMoving = true;
      this.scene.tweens.addCounter({
        from: 0,
        to: this.distance,
        duration: this.speed,
        ease: Phaser.Math.Easing.Sine.InOut,
        repeat: 0,
        yoyo: false,
        onUpdate: (tween, target) => {
          const y = this.startY + target.value;
          const dy = y - this.y;
          this.y = y;
          this.setVelocityY(dy);
        },
      });
    }
  }

  moveHorizontally() {
    if (!this.isMoving) {
      this.isMoving = true;
      this.scene.tweens.addCounter({
        from: 0,
        to: this.distance,
        duration: this.speed,
        repeat: -1,
        yoyo: true,
        onUpdate: (tween, target) => {
          const x = this.startX + target.value;
          const dx = x - this.x;
          this.x = x;
          this.setVelocityX(dx);
        },
        onComplete: () => {
          this.isMoving = false;
        },
      });
    }
  }
}
