const soundBase = '../../static/sounds';

function load(scene, key, fileName, count, volume = 1) {
  const loadingScene = scene;
  for (let index = 1; index <= count; index += 1) {
    const currIndex = index.toString().padStart(2, '0');
    const soundKey = `${key}_${currIndex}`;
    const soundPath = `${soundBase}/${key}/${fileName}_${currIndex}.mp3`;
    scene.load.audio(soundKey, soundPath);
  }
  loadingScene.game.sounds[key] = count;
  loadingScene.game.sounds.volume[key] = volume;
}

export function soundLoader(scene) {
  // sound key, file name, number of files, [relative sound volume]
  load(scene, 'warp_cross', 'warp_cross_a', 3, 0.75);
  load(scene, 'popbase', 'popbase', 4, 2);
  load(scene, 'xbb_death', 'xbb_death_sounds_wobble', 13, 2);
  load(scene, 'void_chatter', 'void_chatter', 10);
  load(scene, 'glass_drop', 'glass_drop_cleaner', 10, 2);
  load(scene, 'diamond_collect', 'diamond_collect', 3, 2);
  load(scene, 'xbb_run_left', 'xbb_left_footfall', 14, 0.3);
  load(scene, 'xbb_run_right', 'xbb_right_footfall', 14, 0.3);
}

export default soundLoader;
