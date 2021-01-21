import { SOUND_WALK_DELAY } from '../constants';

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
    const volume = (game.sounds.volume[key] || 1) * game.app.settings.sound.volume;
    sound.play({ volume });
  }
}

export function playWalkSound(scene, key) {
  const player = scene.game.sounds.walk[key];
  const step = player.step || 'right';
  const lastStep = player.lastStep || 0;
  const now = Date.now();
  if (lastStep + SOUND_WALK_DELAY[key] < now) {
    playSound(scene, `xbb_run_${step}`);
    const newStep = (step === 'right') ? 'left' : 'right';
    player.step = newStep;
    player.lastStep = now;
  }
}

export default playSound;
