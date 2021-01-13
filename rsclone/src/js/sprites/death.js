import Emitter from '../utils/emitter';

export default class Death {
  static deathAnimation(scene, creatureObject, creatureType) {
    const dying = creatureObject;
    if (!creatureObject.isAlive) {
      scene.tweens.addCounter({
        onUpdate: () => {
          if (creatureObject.scale >= 0.1) {
            dying.scale -= 0.1;
          }
        },
      });
      switch (creatureType) {
        case 'enemy': {
          const topEmitter = new Emitter(scene, creatureObject, 'triangle');
          const bottomEmitter = new Emitter(scene, creatureObject, 'crystal', false, 4000);
          topEmitter.emitParticles(50);
          bottomEmitter.emitParticles(10);
          break;
        }
        case 'player': {
          const emitter = new Emitter(scene, creatureObject, 'circle');
          emitter.emitParticles(50);
          break;
        }
        default:
          break;
      }
    }
  }
}