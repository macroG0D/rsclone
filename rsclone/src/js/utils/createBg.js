export function createBg(scene, color = 0xE5E5E5) {
  const background = scene.add.graphics();
  background.fillStyle(color, 1.0);
  background.fillRect(0, 0, scene.game.config.width, scene.game.config.height);
}

export default createBg;
