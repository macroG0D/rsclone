import { SOUND_VOLUME } from '../constants';

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

export function playSound(scene, key) {
  const { game } = scene;
  const soundCount = game.sounds[key];
  if (soundCount) {
    const soundNumber = getRandomInt(1, soundCount).toString().padStart(2, '0');
    const soundKey = `${key}_${soundNumber}`;
    if (!game.sounds.cache[soundKey]) game.sounds.cache[soundKey] = game.sound.add(soundKey);
    const sound = game.sounds.cache[soundKey];
    sound.play({ volume: SOUND_VOLUME });
  }
}

export default playSound;
