import Phaser from 'phaser';
import Death from './Death';

export default class Enemy extends Phaser.Physics.Matter.Sprite {
  constructor(scene, x, y, spriteA, spriteB, options) {
    super(scene.matter.world, x, y, spriteA, 0, options);
    this.isAlive = true;
    this.startY = y;
    this.startX = x;

    // const OFFSETBETWEENSPRITES = 55;
    this.butt = scene.add.sprite(x, y + 55, spriteB);

    const { Body, Bodies } = Phaser.Physics.Matter.Matter;

    this.sensors = {
      top: Bodies.circle(0, 0, 40, {
        isSensor: true,
      }),
      bottom: Bodies.circle(0, 16, 40, {
        isSensor: true,
      }),
    };

    const compoundBody = Body.create({
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
    scene.add.existing(this);

    this.body.parts[1].position.y += 28;
    this.body.parts[2].position.y += 28;

    scene.matterCollision.addOnCollideStart({
      objectA: [this.sensors.top],
      callback: this.killPlayer,
      context: this,
    });
    scene.matterCollision.addOnCollideStart({
      objectA: [this.sensors.bottom],
      callback: this.gotKilled,
      context: this,
    });
    this.scene.events.on('update', this.update, this);
  }

  killPlayer(pair) {
    if (pair.gameObjectB && (pair.gameObjectB.key === 'ibb' || pair.gameObjectB.key === 'obb')) {
      const player = pair.gameObjectB;
      player.isAlive = false;
      this.isAlive = true;
    }
  }

  gotKilled(pair) {
    if (pair.gameObjectB.type !== 'Rectangle' && pair.gameObjectB.isAlive) {
      this.isAlive = false;
      Death.deathAnimation(this.scene, this);
    }
  }

  moveHorizontally(length, direction, speedMS) {
    let destination = length;
    if (direction === 'right') {
      destination = Math.abs(destination);
    } else {
      destination *= -1;
    }
    this.scene.tweens.addCounter({
      from: 0,
      to: destination,
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
        const x = this.startX + target.value;
        const dx = x - this.x;
        this.x = x;
        this.butt.x = this.x;
        this.butt.y = this.y + 55;
        this.setVelocityX(dx);
        if (this.x === this.startX) {
          this.setFlipX(false);
        }
      },
      onYoyo: () => {
        this.setFlipX(true);
      },
    });
  }

  // may be needed for jumping enemies
  moveVertically() {
    this.scene.tweens.addCounter({
      from: 0,
      to: -200,
      duration: 500,
      ease: Phaser.Math.Easing.Sine.InOut,
      repeat: -1,
      yoyo: true,
      onUpdate: (tween, target) => {
        const y = this.startY + target.value;
        const buttY = this.startY - target.value;
        const dy = y - this.y;
        this.y = y;
        this.butt.y = buttY + 55;
        this.setVelocityY(dy);
      },
    });
  }
}
