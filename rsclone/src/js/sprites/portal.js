import Phaser from 'phaser';
import { COLLISION_CATEGORIES, PARTICLES_COLORS } from '../constants';

export default class Portal extends Phaser.GameObjects.Rectangle {
  constructor(scene, x, y, width, height, color, isVertical, objSettings,
    collisionGroup = [COLLISION_CATEGORIES.ibb, COLLISION_CATEGORIES.obb]) {
    super(scene, x, y, width, height, color); // new Rectangle()
    scene.matter.add.gameObject(this, objSettings);
    this.collisionGroup = collisionGroup;
    this.checkTint();
    this.addBubbles(scene, x, y, width, height);
    this.isVertical = isVertical;
  }

  checkTint() {
    this.shouldTint = !Array.isArray(this.collisionGroup);
    if (this.shouldTint) {
      this.getParticlesTint();
    }
  }

  getParticlesTint() {
    const isIbb = this.collisionGroup === COLLISION_CATEGORIES.ibb;
    this.tintColor = isIbb ? PARTICLES_COLORS.ibb[0] : PARTICLES_COLORS.obb[0];
  }

  addBubbles(scene, x, y, width, height) {
    /* adding bubble */
    this.particle = scene.add.particles('bubble');
    this.particle.setDepth(1); // z-index
    /* in original game bubbles can spawn higher then the wall height
    therefore adding additional space for bubbles spawn zone */
    const BUBBLES_ZONE_ADDITIONAL_SPACE = 5;
    /* as we are adding rectangle without matter physics, it's coordinates are counted from
    [0,0] not center of mass, therefore recalculating position of emitter rectangle */
    this.emitterParams = {
      x: x - width / 2,
      y: y - height / 2 - BUBBLES_ZONE_ADDITIONAL_SPACE,
      width,
      height: height + BUBBLES_ZONE_ADDITIONAL_SPACE * 2,
    };
    /* bound where bubbles are locked */
    const emitterBounds = new Phaser.Geom.Rectangle(
      this.emitterParams.x,
      this.emitterParams.y,
      this.emitterParams.width,
      this.emitterParams.height,
    );
    /* creating bubbles emitter */
    this.emitter = this.particle.createEmitter({
      x,
      y,
      lifespan: 4000,
      angle: { min: 0, max: 360 },
      speed: { min: 20, max: 50 },
      scale: { min: 0.25, max: 1 },
      bounce: 0.8,
      bounds: emitterBounds,
    });
    if (this.shouldTint) {
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
    if (this.shouldTint) {
      passingEmitter.setTint(this.tintColor);
    }
    passingEmitter.stop();
    passingEmitter.explode(15);
    setTimeout(() => {
      passingEmitter.remove();
    }, lifespanTime);
  }
}
