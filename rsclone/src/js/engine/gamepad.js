import Phaser from 'phaser';

export default class Gamepad extends Phaser.Events.EventEmitter {
  constructor(scene, playerKey, position, config) {
    super();
    this.scene = scene;
    this.player = playerKey;
    this.createGamepad(position, config);
    /*
    this.controls = {};
    controls.forEach((controlKey, controlIndex) => {
      const direction = CONTROL_KEYS_SEQUENCE[controlIndex];
      this.controls[direction] = this.scene
        .input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[controlKey], true, true);

      this.controls[direction].on('down', () => {
        if (!this.scene.online) {
          this.scene.setDirection(playerKey, direction, true);
          return;
        }
        this.scene.client.sendData('playerMove', {
          playerKey,
          direction,
          movementFlag: true,
        });
      });

      this.controls[direction].on('up', () => {
        if (!this.scene.online) {
          this.scene.setDirection(playerKey, direction, false);
          return;
        }
        this.scene.client.sendData('playerMove', {
          playerKey,
          direction,
          movementFlag: false,
        });
      });
    });
    */
  }

  createGamepad(position, config = '4dir') {
    const { scene } = this;
    const radius = 100;
    const padding = 50;
    const size = radius + padding;
    const x = (position === 1) ? size : scene.game.config.width - size;
    const y = scene.game.config.height - size;

    const mainColor = (position === 1) ? 0x23a645 : 0xde2e6b;
    const secondaryColor = (position === 1) ? 0xde2e6b : 0x23a645;

    this.joystick = scene.plugins.get('rexVirtualJoystick').add(scene, {
      x,
      y,
      radius,
      base: scene.add.circle(0, 0, radius, mainColor),
      thumb: scene.add.circle(0, 0, radius / 2, secondaryColor),
      fixed: true,
      dir: config,
    });
    this.joystick.base.alpha = 0.75;
  }
}
