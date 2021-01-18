const soundBase = '../../static/sounds';

function load(scene, key, fileName, count) {
  const loadingScene = scene;
  for (let index = 1; index <= count; index += 1) {
    const currIndex = index.toString().padStart(2, '0');
    const soundKey = `${key}_${currIndex}`;
    const soundPath = `${soundBase}/${key}/${fileName}_${currIndex}.mp3`;
    scene.load.audio(soundKey, soundPath);
  }
  loadingScene.game.sounds[key] = count;
}

export function soundLoader(scene) {
  load(scene, 'warp_cross', 'warp_cross_a', 3);
  load(scene, 'popbase', 'popbase', 4);
  load(scene, 'xbb_death', 'xbb_death_sounds_wobble', 13);
  load(scene, 'void_chatter', 'void_chatter', 10);
  load(scene, 'glass_drop', 'glass_drop_cleaner', 10);
  load(scene, 'diamond_collect', 'diamond_collect', 3);
  console.log(scene.cache);
}

export default soundLoader;
