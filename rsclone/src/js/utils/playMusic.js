import { MUSIC_VOLUME } from '../constants';

const trackList = {
  MainMenu: 'menu',
  Level1: 'level1',
  Level2: 'level2',
};

const musicConfig = { volume: MUSIC_VOLUME, loop: true };

export function playMusic(scene) {
  const { game } = scene;
  const { key } = scene.scene;
  const track = trackList[key];
  if (track) {
    const musicKey = `${track}_music`;
    if (!game.music.cache[musicKey]) game.music.cache[musicKey] = game.sound.add(musicKey);
    const music = game.music.cache[musicKey];
    const currentMusic = game.music.current;
    if (currentMusic && currentMusic.key !== music.key) currentMusic.stop();
    if (!music.isPlaying) music.play(musicConfig);
    game.music.current = music;
  }
}

export default playMusic;
