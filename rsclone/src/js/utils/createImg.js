function animate(scene, character, delay) {
  scene.tweens.add({
    targets: character,
    scale: 1.1,
    ease: 'Linear',
    duration: 1000,
    delay,
    yoyo: true,
    repeat: -1,
  });
}

export function createImg(scene, drawKeys = false) {
  scene.add.image(314, 215, 'ibbBg');
  const ibb = scene.add.image(314, 215, 'ibbImg');
  animate(scene, ibb, 0);
  scene.add.image(967, 215, 'obbBg');
  const obb = scene.add.image(967, 215, 'obbImg');
  animate(scene, obb, 1000);
  if (drawKeys) {
    scene.add.image(314, 437, 'ibbKeys');
    scene.add.image(967, 437, 'obbKeys');
  }
}

export default createImg;
