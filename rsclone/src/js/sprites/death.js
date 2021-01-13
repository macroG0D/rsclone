export default class Death {
  static deathAnimation(scene, creature) {
    const dying = creature;
    if (!creature.isAlive) {
      scene.tweens.addCounter({
        onUpdate: () => {
          if (creature.scaleX >= 0.1) {
            dying.scaleY -= 0.1;
            dying.scaleX -= 0.1;
          }
        },
      });
    }
  }
}
