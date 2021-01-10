import { SOUND_VOLUME } from '../constants';

export function playSound(scene, key) {
  const { game } = scene;
  const sound = game.sound.add(key);
  sound.play({ volume: SOUND_VOLUME });
}

export default playSound;
