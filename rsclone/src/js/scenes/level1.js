import Phaser from 'phaser';
import Player from '../sprites/player';
import Portal from '../sprites/portal';
import { gradientSquares, gradientColors, walls } from '../levels/level1/backgroundStructure';

import { BORDER_THICKNESS } from '../constants';

const player1Controls = ['LEFT', 'RIGHT', 'UP', 'DOWN'];
const player2Controls = ['A', 'D', 'W', 'S'];

const levelWidth = 5369;
const levelHeight = 890;

export default class Level1 extends Phaser.Scene {
  constructor() {
    super('Level1');
  }

  create() {
    this.matter.world.setBounds(0, 0, levelWidth, levelHeight, BORDER_THICKNESS);
    this.cameras.main.setBounds(0, 0, levelWidth, levelHeight);
    this.cameras.main.roundPixels = true;
    this.addBackgrounds();
    this.addWalls();
    this.ibb = new Player(this, 'ibb', 3500, 200, 'ibb-sprite', player1Controls); // 200 200
    this.obb = new Player(this, 'obb', 3550, 300, 'obb-sprite', player2Controls); // 300 300
    this.addCollisions();
    this.music = this.sound.add('level1_music');
    // this.music.play({ loop: true });
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
    this.walls = [];
    this.portals = [];
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
        // frictionStatic: 0,
        // friction: 0,
      };
      if (isPortal) {
        // moved portal to separate class for better detection in collision event with instanceof
        // eslint-disable-next-line no-new
        new Portal(this, wallX, wallY, wallWidth, wallHeight, wallColor, objSettings);
      } else {
        const wall = this.add.rectangle(wallX, wallY, wallWidth, wallHeight, wallColor);
        this.matter.add.gameObject(wall, objSettings);
      }
    });
  }

  addCollisions() {
    /* collision event between two objects */
    this.matter.world.on('collisionstart', (event) => {
      event.pairs.forEach((pair) => {
        const { bodyA, bodyB } = pair;
        const gameObjectB = bodyB.gameObject;
        const gameObjectA = bodyA.gameObject;
        if (gameObjectB instanceof Phaser.Physics.Matter.Sprite) {
          /* storing boolean that will show us if player sprite is on ground,
          so we can apply jump velocity to it */
          gameObjectB.isOnGround = true;
        }
        if (gameObjectA instanceof Phaser.Physics.Matter.Sprite) {
          /* storing boolean that will show us if player sprite is on ground,
          so we can apply jump velocity to it */
          gameObjectA.isOnGround = true;
        }
      });
    });
    /* using collision active event to trigger flip when player body centers with portal body */
    this.matter.world.on('collisionactive', (event) => {
      event.pairs.forEach((pair) => {
        const { bodyA, bodyB } = pair;
        const gameObjectB = bodyB.gameObject;
        const gameObjectA = bodyA.gameObject;
        // checking for portal and player collision
        if (gameObjectA instanceof Portal && gameObjectB instanceof Player) {
          const portal = gameObjectA;
          const player = gameObjectB;
          const pixelsInterval = 5;
          const playerCenterY = Math.round(player.y + player.height / 2);
          const portalCenterY = Math.round(portal.y + portal.height / 2);
          /* because collision event triggers with time interval we cant strictly compare two values
          so we are comparing player center position in small range around portal center */
          const playerLowerRangePos = playerCenterY < portalCenterY + pixelsInterval;
          const playerUpperRangePos = playerCenterY > portalCenterY - pixelsInterval;
          if (playerLowerRangePos && playerUpperRangePos) {
            player.switchGravity();
          }
        }
      });
    });
  }

  centerCamera() {
    const cam = this.cameras.main;
    const ibbCoord = {
      x: this.ibb.sensors.bottom.position.x,
      y: this.ibb.sensors.bottom.position.y,
    };
    const obbCoord = {
      x: this.obb.sensors.bottom.position.x,
      y: this.obb.sensors.bottom.position.y,
    };
    const charactersXDiff = Math.abs(obbCoord.x - ibbCoord.x);
    const charactersYDiff = Math.abs(obbCoord.y - ibbCoord.y);
    const zoomCoef = charactersXDiff / cam.width;
    const camZoom = 1 - 0.2 * zoomCoef;
    const closestToLeftCharacterX = ibbCoord.x > obbCoord.x ? obbCoord.x : ibbCoord.x;
    const closestToTopCharacterY = ibbCoord.y > obbCoord.y ? obbCoord.y : ibbCoord.y;
    const cameraX = parseInt(charactersXDiff / 2 + closestToLeftCharacterX, 10);
    const cameraY = parseInt(charactersYDiff / 2 + closestToTopCharacterY, 10);
    if (camZoom !== cam.zoom) cam.setZoom(camZoom);
    if (cameraX !== cam.midPoint.x) cam.centerOnX(cameraX);
    if (cameraY !== cam.midPoint.Y) cam.centerOnY(cameraY);
  }

  update() {
    this.centerCamera();
  }
}
