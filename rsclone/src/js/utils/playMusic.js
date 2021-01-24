const trackList = {
  MainMenu: 'menu',
  Level1: 'level1',
  Level2: 'level2',
};
export function playMusic(scene) {
  const { game } = scene;
  const { key } = scene.scene;
  const track = trackList[key];
  const volume = scene.game.app.settings.volume.music;
  const musicConfig = { volume, loop: true };
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
