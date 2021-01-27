export default class NetworkInput {
  constructor(scene) {
    if (scene.client) {
      scene.client.on('playerMove', (data) => {
        const { playerKey, direction, movementFlag } = data;
        scene.setDirection(playerKey, direction, movementFlag);
      });
    }
  }
}
