import Emitter from '../engine/emitter';

import { playSound } from '../utils/playSound';

export default class Death {
  static deathAnimation(scene, creatureObject, creatureType) {
    const dying = creatureObject;
    if (!creatureObject.isAlive) {
      scene.tweens.addCounter({
        onUpdate: () => {
          if (creatureObject.scale >= 0.1) dying.scale -= 0.1;
        },
      });
      switch (creatureType) {
        case 'enemy': {
          const topEmitter = new Emitter(scene, creatureObject, 'triangle', creatureObject.reverseGravity);
          const bottomEmitter = new Emitter(scene, creatureObject, 'crystal', creatureObject.reverseGravity, 4000);
          topEmitter.emitParticles(50);
          playSound(scene, 'glass_drop');
          bottomEmitter.emitParticles(10);
          playSound(scene, 'void_chatter');
          break;
        }
        case 'player': {
          const emitter = new Emitter(scene, creatureObject, 'circle', creatureObject.isRotated);
          emitter.emitParticles(50);
          playSound(scene, 'xbb_death');
          scene.events.emit('GameOver');
          break;
        }
        default:
          break;
      }
    }
  }
}
