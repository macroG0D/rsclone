import { playSound } from '../utils/playSound';

import { COLLISION_CATEGORIES, PARTICLES_COLORS } from '../constants';

export default class Emitter {
  constructor(scene, gameObject, particleType, reverseGravity = false, particleLifespan = 2000) {
    this.scene = scene;
    this.gameObject = gameObject;
    this.particleType = particleType;
    this.particleLifespan = particleLifespan;
    this.reverseGravity = reverseGravity;
    this.particleColors = this.gameObject.key === 'ibb' ? PARTICLES_COLORS.ibb : PARTICLES_COLORS.obb;
  }

  emitParticles(amount) {
    const particleKillTimeout = 50;
    const minScale = 0.5;
    const maxScale = 1;
    for (let i = 0; i < amount; i += 1) {
      let particleGameObject;
      const randomScale = Math.random() * (maxScale - minScale) + minScale;
      const matterParams = {
        isSensor: false,
        isStatic: false,
        gravityScale: {
          x: 1,
          y: this.reverseGravity ? -1 : 1,
        },
      };
      switch (this.particleType) {
        case 'circle': {
          const particleRadius = 5;
          const randomArrayColorNumber = Math.floor(Math.random() * this.particleColors.length);
          const randomColor = this.particleColors[randomArrayColorNumber];
          particleGameObject = this.scene.add.circle(
            this.gameObject.x,
            this.gameObject.y,
            particleRadius,
            randomColor,
          );
          break;
        }
        case 'triangle': {
          const triangleSize = 5;
          const triangleParams = {
            x: this.gameObject.x,
            y: this.gameObject.y,
            x1: -triangleSize,
            y1: triangleSize,
            x2: triangleSize,
            y2: triangleSize,
            x3: 0,
            y3: -triangleSize,
          };
          particleGameObject = this.scene.add.triangle(
            triangleParams.x, triangleParams.y,
            triangleParams.x1, triangleParams.y1,
            triangleParams.x2, triangleParams.y2,
            triangleParams.x3, triangleParams.y3,
            0x000000,
          );
          break;
        }
        case 'crystal': {
          particleGameObject = this.scene.add.image(this.gameObject.x, this.gameObject.y, 'crystal');
          break;
        }
        default:
          break;
      }
      if (this.particleType !== 'crystal') particleGameObject.setScale(randomScale);
      const particle = this.scene.matter.add.gameObject(
        particleGameObject,
        matterParams,
      );
      if (this.particleType === 'crystal') {
        const crystalScoreValue = 10;
        this.scene.matterCollision.addOnCollideStart({
          objectA: particle,
          objectB: [this.scene.ibb, this.scene.obb],
          callback: (eventData) => {
            eventData.gameObjectA.destroy();
            this.scene.events.emit('updateScore', crystalScoreValue);
            playSound(this.scene, 'diamond_collect');
          },
          context: this,
        });
      }
      const collisionCategory = this.particleType === 'crystal' ? COLLISION_CATEGORIES.physicalParticle : COLLISION_CATEGORIES.visualParticle;
      const collidesWith = this.particleType === 'crystal' ? [COLLISION_CATEGORIES.ibb, COLLISION_CATEGORIES.obb, COLLISION_CATEGORIES.wall] : COLLISION_CATEGORIES.wall;
      particle.setCollisionCategory(collisionCategory);
      particle.setCollidesWith(collidesWith);

      const velocityX = (Math.round(Math.random()) * 2 - 1) * Math.random() * 10;
      const velocityY = Math.random() * (this.reverseGravity ? 15 : -15);
      particle.setVelocity(velocityX, velocityY);
      const particleKillDelay = particleKillTimeout * (i + 1);
      setTimeout(() => {
        particle.destroy();
      }, this.particleLifespan + particleKillDelay);
    }
  }
}
