import Phaser from 'phaser';
import Player from '../sprites/player';
import Portal from '../sprites/portal';
import { gradientSquares, gradientColors, walls } from '../levels/level1/backgroundStructure';

import { BORDER_THICKNESS } from '../constants';
import { playMusic } from '../utils/music';

const player1Controls = ['LEFT', 'RIGHT', 'UP', 'DOWN'];
const player2Controls = ['A', 'D', 'W', 'S'];

const levelWidth = 5369;
const levelHeight = 890;

export default class Level1 extends Phaser.Scene {
  constructor() {
    super('Level1');
    this.walls = [];
    this.portals = [];
  }

  create() {
    this.matter.world.setBounds(0, 0, levelWidth, levelHeight, BORDER_THICKNESS);
    this.cameras.main.setBounds(0, 0, levelWidth, levelHeight);
    this.cameras.main.roundPixels = true;
    this.addBackgrounds();
    this.addWalls();
    this.ibb = new Player(this, 'ibb', 3350, 400, 'ibb-sprite', player1Controls); // 200 200
    this.obb = new Player(this, 'obb', 3300, 400, 'obb-sprite', player2Controls); // 300 300
    this.cursors = this.input.keyboard.createCursorKeys();
    playMusic(this, 'level1_music');
  }

  addBackgrounds() {
    // main background
    this.background = this.add.graphics();
    this.background.fillGradientStyle(0x3C6771, 0xB3B061, 0x3C6771, 0xB3B061, 1);
    this.background.fillRect(0, 0, levelWidth, levelHeight);
    // underworld backgrounds
    gradientSquares.forEach((item, index) => {
      const { width, height } = item;
      const top = levelHeight - height;
      let left = 0;
      let i = index;
      while (i > 0) {
        i -= 1;
        left += gradientSquares[i].width;
      }
      const startColor = gradientColors[index];
      const endColor = gradientColors[index + 1];
      const bg = this.add.graphics();
      bg.fillGradientStyle(startColor, endColor, startColor, endColor, 1);
      bg.fillRect(left, top, width, height);
    });
  }

  addWalls() {
    const wallDefaultColor = 0x082228;
    const portalColor = 0xffffff;
    const wallDefaultHeight = 16;

    walls.forEach((item) => {
      const {
        width,
        y,
        x,
        isPortal,
        isVertical,
      } = item;
      const top = y - wallDefaultHeight;
      const wallHeight = isVertical ? width : wallDefaultHeight;
      const wallWidth = isVertical ? wallDefaultHeight : width;
      const wallColor = isPortal ? portalColor : wallDefaultColor;
      const wallX = x + wallWidth / 2;
      const wallY = top + wallHeight / 2;
      // these and other options should be configured for proper physic behaviour
      const objSettings = {
        isSensor: isPortal,
        isStatic: true,
      };
      if (isPortal) {
        // moved portal to separate class for better detection in collision event with instanceof
        const portal = new Portal(
          this, wallX, wallY, wallWidth, wallHeight, wallColor, objSettings,
        );
        this.portals.push(portal);
      } else {
        const wall = this.add.rectangle(wallX, wallY, wallWidth, wallHeight, wallColor);
        const wallGameObject = this.matter.add.gameObject(wall, objSettings);
        wallGameObject.setCollisionGroup(2); // we have to add collision groups to make emitter work
      }
    });
  }

  centerCamera() {
    const cam = this.cameras.main;
    const ibbCoords = {
      x: this.ibb.sensors.bottom.position.x,
      y: this.ibb.sensors.bottom.position.y,
    };
    const obbCoords = {
      x: this.obb.sensors.bottom.position.x,
      y: this.obb.sensors.bottom.position.y,
    };
    const charactersXDiff = Math.abs(obbCoords.x - ibbCoords.x);
    const charactersYDiff = Math.abs(obbCoords.y - ibbCoords.y);
    const camZoom = 1 - 0.2 * (charactersXDiff / cam.width);
    const closestToLeftCharacterX = ibbCoords.x > obbCoords.x ? obbCoords.x : ibbCoords.x;
    const closestToTopCharacterY = ibbCoords.y > obbCoords.y ? obbCoords.y : ibbCoords.y;
    const cameraX = parseInt(charactersXDiff / 2 + closestToLeftCharacterX, 10);
    const cameraY = parseInt(charactersYDiff / 2 + closestToTopCharacterY, 10);
    if (camZoom !== cam.zoom) cam.setZoom(camZoom);
    if (cameraX !== cam.midPoint.x) cam.centerOnX(cameraX);
    if (cameraY !== cam.midPoint.Y) cam.centerOnY(cameraY);
    this.charactersDistance = charactersXDiff;
  }

  update() {
    this.centerCamera();
    this.cursors.space.on('down', () => {
      this.scene.pause();
      this.scene.run('GameMenu');
    });
  }
}
