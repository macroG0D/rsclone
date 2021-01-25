import Phaser from 'phaser';
import { COLLISION_CATEGORIES, PARTICLES_COLORS } from '../constants';

export default class Portal extends Phaser.GameObjects.Rectangle {
  constructor(scene, x, y, width, height, color, isVertical, objSettings, collisionGroup) {
    super(scene, x, y, width, height, color); // new Rectangle()
    this.depth = 200;
    // console.log(this.depth);
    scene.matter.add.gameObject(this, objSettings);
    if (collisionGroup) {
      this.collisionGroup = collisionGroup;
      this.checkTint();
      this.addWall(scene, x, y, width, height, collisionGroup);
    }
    this.isVertical = isVertical;
    this.addBubbles(scene, x, y, width, height);
  }

  checkTint() {
    if (this.collisionGroup) {
      this.getParticlesTint();
    }
  }

  addWall(scene, x, y, width, height, collisionCategory) {
    const wall = new Phaser.GameObjects.Rectangle(scene, x, y, width, height);
    this.additionalWall = scene.matter.add.gameObject(wall, {
      isStatic: true,
      isSensor: false,
    });
    const isIbbPortal = collisionCategory === COLLISION_CATEGORIES.ibb;
    const collidesWith = isIbbPortal ? COLLISION_CATEGORIES.obb : COLLISION_CATEGORIES.ibb;
    this.additionalWall.setCollisionCategory(collisionCategory);
    this.additionalWall.setCollidesWith(collidesWith);
  }

  getParticlesTint() {
    const isIbbPortal = this.collisionGroup === COLLISION_CATEGORIES.ibb;
    this.tintColor = isIbbPortal ? PARTICLES_COLORS.ibb[0] : PARTICLES_COLORS.obb[0];
  }

  addBubbles(scene, x, y, width, height) {
    /* adding bubble */
    this.particle = scene.add.particles('bubble');
    this.particle.setDepth(1); // z-index
    /* in original game bubbles can spawn higher then the wall height
    therefore adding additional space for bubbles spawn zone */
    const ADDITIONAL_SPACE = 5;
    /* as we are adding rectangle without matter physics, it's coordinates are counted from
    [0,0] not center of mass, therefore recalculating position of emitter rectangle */
    const xCoord = this.isVertical ? x - width / 2 - ADDITIONAL_SPACE : x - width / 2;
    const yCoord = this.isVertical ? y - height / 2 : y - height / 2 - ADDITIONAL_SPACE;
    const resultWidth = this.isVertical ? width + ADDITIONAL_SPACE * 2 : width;
    const resultHeight = this.isVertical ? height : height + ADDITIONAL_SPACE * 2;
    this.emitterParams = {
      x: xCoord,
      y: yCoord,
      width: resultWidth,
      height: resultHeight,
    };
    /* bound where bubbles are locked */
    const emitterBounds = new Phaser.Geom.Rectangle(
      this.emitterParams.x,
      this.emitterParams.y,
      this.emitterParams.width,
      this.emitterParams.height,
    );
    /* creating bubbles emitter */
    this.particle.depth = 200;
    this.emitter = this.particle.createEmitter({
      x,
      y,
      lifespan: width * 12 + 1700,
      angle: { min: 0, max: 360 },
      speed: { min: 20, max: 70 },
      scale: { min: 0.25, max: 1 },
      bounce: 0.8,
      bounds: emitterBounds,
    });
    if (this.collisionGroup) {
      this.emitter.setTint(this.tintColor);
    }
  }

  emitParticles(x, y, characterWidth, characterHeight, velocity, flipY) {
    const additionalEmitterWidth = 0;
    const directionVelocity = this.isVertical ? velocity.x : velocity.y;
    const angleValue = this.isVertical ? 0 : 90;
    const lifespanTime = 1000;
    const gravityValue = Math.abs(directionVelocity) * 40;
    const emitterAngle = flipY ? Math.abs(angleValue + 180) : angleValue;
    const speedCoefs = {
      min: this.isVertical ? 15 : 10,
      max: this.isVertical ? 30 : 25,
    };
    const emitterSpeed = {
      min: directionVelocity * speedCoefs.min,
      max: directionVelocity * speedCoefs.max,
    };
    const emitterGravity = flipY ? gravityValue : -gravityValue;
    let emitterLine;
    if (this.isVertical) {
      emitterLine = new Phaser.Geom.Line(
        x + this.emitterParams.width / 2, // x1
        y - characterHeight / 2, // y1
        x + this.emitterParams.width / 2, // x2
        y + characterHeight / 2, // y2
      );
    } else {
      emitterLine = new Phaser.Geom.Line(
        x - additionalEmitterWidth / 2 - characterWidth / 2, // x1
        this.emitterParams.y + this.emitterParams.height / 2, // y1
        x + characterWidth + additionalEmitterWidth, // x2
        this.emitterParams.y + this.emitterParams.height / 2, // y2
      );
    }
    const emitterConfig = {
      lifespan: lifespanTime,
      speed: emitterSpeed,
      scale: { min: 0.25, max: 1 },
      angle: emitterAngle,
      alpha: {
        start: 1,
        end: 0,
        ease: 'Sine.easeInOut',
      },
      emitZone: {
        source: emitterLine,
        type: 'edge',
        quantity: 15,
      },
    };
    if (this.isVertical) {
      emitterConfig.gravityX = emitterGravity;
    } else {
      emitterConfig.gravityY = emitterGravity;
    }
    const passingEmitter = this.particle.createEmitter(emitterConfig);
    if (this.collisionGroup) {
      passingEmitter.setTint(this.tintColor);
    }
    passingEmitter.stop();
    passingEmitter.explode(15);
    setTimeout(() => {
      passingEmitter.remove();
    }, lifespanTime);
  }
}
