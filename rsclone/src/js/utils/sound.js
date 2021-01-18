import { SOUND_VOLUME } from '../constants';

export function playSound(scene, key) {
  const { game } = scene;
  if (!game.sounds[key]) game.sounds[key] = game.sound.add(key);
  const sound = game.sounds[key];
  sound.play({ volume: SOUND_VOLUME });
}

export default playSound;
