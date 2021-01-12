export default class Emitter {
  constructor(scene, gameObject, particleSprite, particleLifespan) {
    this.scene = scene;
    this.gameObject = gameObject;
    this.particleSprite = particleSprite;
    this.particleLifespan = particleLifespan;
  }

  emitParticles(amount) {
    const particleKillTimeout = 50;
    for (let i = 0; i < amount; i += 1) {
      const particle = this.scene.matter.add.image(
        this.gameObject.x,
        this.gameObject.y,
        this.particleSprite,
        null,
        {
          isSensor: false,
          isStatic: false,
        },
      );
      particle.setCollisionGroup(2);
      particle.setCollidesWith(0);
      const particleKillDelay = particleKillTimeout * (i + 1);
      particle.setVelocity(
        (Math.round(Math.random()) * 2 - 1) * Math.random() * 10,
        Math.random() * -15,
      );
      setTimeout(() => {
        particle.setSensor(false);
      }, 10);
      setTimeout(() => {
        particle.destroy();
      }, this.particleLifespan + particleKillDelay);
    }
  }
}
