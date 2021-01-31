const trackList = {
  MainMenu: 'menu',
  Level1: 'level1',
  Level2: 'level2',
};

export default class Music {
  constructor(game) {
    this.game = game;
    this.cache = {};
  }

  play(scene) {
    if (!scene) {
      if (this.current && this.current.isPaused) this.current.resume();
      return;
    }
    const { game, current } = this;
    const { key } = scene.scene;
    const track = trackList[key];
    const volume = this.game.app.settings.volume.music;
    const musicConfig = { volume, loop: true };
    if (track) {
      this.key = key;
      const musicKey = `${track}_music`;
      if (!this.cache[musicKey]) this.cache[musicKey] = game.sound.add(musicKey);
      const music = this.cache[musicKey];
      if (current && current.key !== music.key) current.stop();
      if (!music.isPlaying) music.play(musicConfig);
      this.current = music;
    }
  }

  pause() {
    if (this.current && this.current.isPlaying) this.current.pause();
  }
}
