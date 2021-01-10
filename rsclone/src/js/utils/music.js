import { MUSIC_VOLUME } from '../constants';

export function playMusic(scene, key) {
  const { game } = scene;
  if (game.music.key && game.music.key !== key) {
    game.music.track.destroy();
    game.music.previousKey = undefined;
  }

  game.music.track = game.sound.add(key);
  game.music.track.play({ volume: MUSIC_VOLUME, loop: true });
  game.music.key = key;
}

export default playMusic;
