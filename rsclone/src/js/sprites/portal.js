import Phaser from 'phaser';

export default class Portal extends Phaser.GameObjects.Rectangle {
  constructor(scene, x, y, width, height, color, objSettings) {
    super(scene, x, y, width, height, color); // new Rectangle()
    scene.matter.add.gameObject(this, objSettings);
    this.addBubbles(scene, x, y, width, height);
  }

  addBubbles(scene, x, y, width, height) {
    /* in original game bubbles can spawn higher then the wall height
    therefore adding additional space for bubbles spawn zone */
    const BUBBLES_ZONE_ADDITIONAL_SPACE = 5;
    /* as we are adding rectangle without matter physics, it's coordinates are counted from
    [0,0] not center of mass, therefore recalculating position of emitter rectangle */
    const params = {
      x: x - width / 2,
      y: y - height / 2 - BUBBLES_ZONE_ADDITIONAL_SPACE,
      width,
      height: height + BUBBLES_ZONE_ADDITIONAL_SPACE * 2,
    };
    const emitterBounds = new Phaser.Geom.Rectangle(
      params.x,
      params.y,
      params.width,
      params.height,
    );
    const particle = scene.add.particles('bubble');
    particle.setDepth(1);
    this.emitter = particle.createEmitter({
      x,
      y,
      lifespan: 3000,
      angle: { min: 0, max: 360 },
      speed: { min: 50, max: 80 },
      scale: { min: 0.25, max: 1 },
      bounce: 0.8,
      bounds: emitterBounds,
    });
  }
}
