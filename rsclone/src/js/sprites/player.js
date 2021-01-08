import Phaser from 'phaser';

function createPlayerAnimations(scene, key, sprite) {
  scene.anims.create({
    key: `move-${key}`,
    frames: scene.game.anims.generateFrameNumbers(sprite),
    frameRate: 62,
    repeat: -1,
  });
}

export default class Player {
  constructor(scene, key, x, y, image) {
    const DEFAULT_MASS = 1;

    this.sprite = scene.matter.add.sprite(x, y, image);
    const { Body, Bodies } = Phaser.Physics.Matter.Matter;
    const { width: w, height: h } = this.sprite;
    const mainBody = Bodies.rectangle(0, 0, w * 0.75, h, {
      chamfer: { radius: 10 },
    });

    this.sensors = {
      top: Bodies.rectangle(0, h - h * 1.5, w * 0.6, 2, { isSensor: true }),
      bottom: Bodies.rectangle(0, h * 0.5, w * 0.6, 2, { isSensor: true }),
      left: Bodies.rectangle(-w * 0.45, 0, 2, h * 0.7, { isSensor: true }),
      right: Bodies.rectangle(w * 0.45, 0, 2, h * 0.7, { isSensor: true }),
    };

    const compoundBody = Body.create({
      parts: [
        mainBody,
        this.sensors.top,
        this.sensors.bottom,
        this.sensors.left,
        this.sensors.right,
      ],
      frictionStatic: 0,
      frictionAir: 0.01,
      friction: 0.1,
      mass: DEFAULT_MASS,
    });
    this.sprite
      .setExistingBody(compoundBody)
      .setFixedRotation() // Sets inertia to infinity so the player can't rotate
      .setPosition(x, y);

    createPlayerAnimations(scene, key, image);
  }
}
