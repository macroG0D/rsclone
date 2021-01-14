import Phaser from 'phaser';
import Death from './death';
import EventsCenter from '../utils/eventsCenter';

export default class Enemy extends Phaser.Physics.Matter.Sprite {
  constructor(scene, x, y, spriteA) {
    super(scene.matter.world, x, y, spriteA);
    this.isAlive = true;
    this.startX = x;
    this.startY = y;
  }

  killPlayer(pair) {
    if (pair.gameObjectB && (pair.gameObjectB.key === 'ibb' || pair.gameObjectB.key === 'obb') && pair.gameObjectB.isAlive) {
      const player = pair.gameObjectB;
      player.isAlive = false;
      Death.deathAnimation(this.scene, player, 'player');
      this.scene.time.addEvent({
        delay: 2000,
        callback: () => {
          const anotherPlayerKey = player.key === 'ibb' ? 'obb' : 'ibb';
          this.scene[anotherPlayerKey].isAlive = false;
          Death.deathAnimation(this.scene, this.scene[anotherPlayerKey], 'player');
        },
      });
    }
  }

  gotKilled(pair) {
    if (pair.gameObjectB && pair.gameObjectB.type !== 'Rectangle' && pair.gameObjectB.isAlive && this.isAlive) {
      this.isAlive = false;
      Death.deathAnimation(this.scene, this, 'enemy');
      EventsCenter.emit('update-score', 100);
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
        this.butt.y = this.y + this.offsetBetweenHeadAndButt;
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
}
