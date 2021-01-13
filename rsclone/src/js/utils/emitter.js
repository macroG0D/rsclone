export default class Emitter {
  constructor(scene, gameObject, particleColors, particleType, particleLifespan) {
    this.scene = scene;
    this.gameObject = gameObject;
    this.particleColors = particleColors;
    this.particleType = 'circle';
    this.particleLifespan = particleLifespan;
  }

  emitParticles(amount) {
    const circleParticleRadius = 5;
    const particleKillTimeout = 50;
    const minScale = 0.5;
    const maxScale = 1;
    for (let i = 0; i < amount; i += 1) {
      const randomColor = this.particleColors[Math.floor(Math.random() * this.particleColors.length)];
      const randomScale = Math.random() * (maxScale - minScale) + minScale;
      const particleGameObject = this.scene.add.circle(this.gameObject.x, this.gameObject.y, circleParticleRadius,randomColor);
      particleGameObject.setScale(randomScale);
      const particle = this.scene.matter.add.gameObject(
        particleGameObject,
        {
          isSensor: false,
          isStatic: false,
        },
      );
      particle.setCollisionGroup(2);
      particle.setCollidesWith(0);
      particle.setVelocity(
        (Math.round(Math.random()) * 2 - 1) * Math.random() * 10,
        Math.random() * -15,
      );
      const particleKillDelay = particleKillTimeout * (i + 1);
      setTimeout(() => {
        particle.destroy();
      }, this.particleLifespan + particleKillDelay);
    }
  }
}
