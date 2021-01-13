import Phaser from 'phaser';

export default class Portal extends Phaser.GameObjects.Rectangle {
  constructor(scene, x, y, width, height, color, objSettings) {
    super(scene, x, y, width, height, color); // new Rectangle()
    scene.matter.add.gameObject(this, objSettings);
    this.addBubbles(scene, x, y, width, height);
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
  }

  emitParticles(x, characterWidth, velocity, flipY) {
    console.log(x, characterWidth, velocity, flipY);
    const additionalEmitterWidth = 0;
    const angleValue = 90;
    const lifespanTime = 1000;
    const gravityValue = Math.abs(velocity) * 40;
    const emitterAngle = flipY ? -angleValue : angleValue;
    const emitterSpeed = { min: velocity * 10, max: velocity * 25 };
    const emitterGravityY = flipY ? gravityValue : -gravityValue;
    const emitterLine = new Phaser.Geom.Line(
      x - additionalEmitterWidth / 2 - characterWidth / 2, // x1
      this.emitterParams.y + this.emitterParams.height / 2, // y1
      x + characterWidth + additionalEmitterWidth, // x2
      this.emitterParams.y + this.emitterParams.height / 2, // y2
    );
    const passingEmitter = this.particle.createEmitter({
      lifespan: lifespanTime,
      speed: emitterSpeed,
      scale: { min: 0.25, max: 1 },
      angle: emitterAngle,
      gravityY: emitterGravityY,
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
    });
    passingEmitter.stop();
    passingEmitter.explode(15);
    setTimeout(() => {
      passingEmitter.remove();
    }, lifespanTime);
  }
}
