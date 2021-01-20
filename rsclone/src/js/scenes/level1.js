import Phaser from 'phaser';

import Player from '../sprites/player';
import Portal from '../sprites/portal';
import MovingPlatform from '../sprites/movingPlatform';

import Input from '../utils/input';
import NetworkInput from '../utils/networkInput';
import NetworkSync from '../utils/networkSync';

import StandartHedgehog from '../sprites/enemies/standartHedgehog';
import JumpingHedgehog from '../sprites/enemies/jumpingHedgehog';
import { gradientSquares, gradientColors, walls } from '../levels/level1/backgroundStructure';

import {
  BORDER_THICKNESS,
  PLAYER_1_CONTROLS,
  PLAYER_2_CONTROLS,
  COLLISION_CATEGORIES,
} from '../constants';

import { playMusic } from '../utils/playMusic';
import EventsCenter from '../utils/eventsCenter';

const levelWidth = 10500; // 5369
const levelHeight = 2890;

const parallaxImages = {
  sky: 0.2,
  clouds_0: 0.1,
  bg_0: 0.1,
  bg_1: 0.2,
  bg_2: 0.3,
};
export default class Level1 extends Phaser.Scene {
  constructor() {
    super('Level1');
    this.walls = [];
    this.portals = [];
    this.score = 0;
  }

  create(gameData) {
    this.client = this.game.client;
    if (gameData && gameData.online) {
      this.online = true;
      this.playerKey = (gameData.master) ? 'ibb' : 'obb';
      this.player1Input = new Input(this, this.playerKey, PLAYER_1_CONTROLS);
      this.networkInput = new NetworkInput(this);
      this.networkSync = new NetworkSync(this, this.playerKey);
    } else {
      this.player1Input = new Input(this, 'ibb', PLAYER_1_CONTROLS);
      this.player2Input = new Input(this, 'obb', PLAYER_2_CONTROLS);
    }
    EventsCenter.destroy(); // destory preveousely created instance to prevent score multiply
    this.matter.world.setBounds(0, 0, levelWidth, levelHeight, BORDER_THICKNESS);
    this.cameras.main.setBounds(0, 0, levelWidth, levelHeight);
    this.cameras.main.roundPixels = true;
    // this.addBackgrounds();
    this.addParallax();
    this.addWalls();

    this.movingPlatform1 = new MovingPlatform(this, 6500, 1330, 'platform-long', 1100, 'horizontal');
    this.movingPlatform2 = new MovingPlatform(this, 10000, 1800, 'platform-long', -1580, 'vertical');

    this.obb = new Player(this, 'obb', 200, 1100, 'obb-move', COLLISION_CATEGORIES.obb);
    this.ibb = new Player(this, 'ibb', 300, 1200, 'ibb-move', COLLISION_CATEGORIES.ibb);
    this.ibb.headStandingCheck();
    this.obb.headStandingCheck();
    // enemies spawn
    // enemies set 1
    this.hedgehog1 = new JumpingHedgehog(this, 1125, 1900, 'hedgehog-jumper', 'hedgehog-fullbutt');
    this.hedgehog1.moveHorizontally(50, 'left', 250);
    this.hedgehog1.jump(800, 1200);
    this.hedgehog2 = new StandartHedgehog(this, 1450, 1356, 'hedgehog-head', 'hedgehog-halfbutt');
    this.hedgehog2.moveHorizontally(185, 'left', 1800);
    // enemies set 2
    this.hedgehog3 = new JumpingHedgehog(this, 2000, 1592, 'hedgehog-jumper', 'hedgehog-fullbutt');
    this.hedgehog3.jump(50, 800);
    this.hedgehog4 = new JumpingHedgehog(this, 2150, 1694, 'hedgehog-jumper', 'hedgehog-fullbutt', true, 100);
    this.hedgehog4.jump(180, 700);
    this.hedgehog5 = new JumpingHedgehog(this, 2300, 1592, 'hedgehog-jumper', 'hedgehog-fullbutt');
    this.hedgehog5.jump(180, 900);
    this.hedgehog6 = new JumpingHedgehog(this, 2450, 1592, 'hedgehog-jumper', 'hedgehog-fullbutt');
    this.hedgehog6.jump(180, 500);
    this.hedgehog7 = new JumpingHedgehog(this, 2600, 1695, 'hedgehog-jumper', 'hedgehog-fullbutt', true);
    this.hedgehog7.jump(15090, 5600);
    this.hedgehog8 = new JumpingHedgehog(this, 2750, 1592, 'hedgehog-jumper', 'hedgehog-fullbutt');
    this.hedgehog8.jump(180, 450);
    // enemies set 3
    this.hedgehog9 = new StandartHedgehog(this, 3400, 1368, 'hedgehog-head', 'hedgehog-halfbutt', true);
    this.hedgehog9.moveHorizontally(300, 'left', 2500, 'Bounce', 'Out');
    this.hedgehog10 = new StandartHedgehog(this, 3550, 1368, 'hedgehog-head', 'hedgehog-halfbutt', true);
    this.hedgehog10.moveHorizontally(300, 'left', 2500, 'Bounce', 'In');

    this.hedgehog11 = new StandartHedgehog(this, 4290, 1457, 'hedgehog-head', 'hedgehog-halfbutt');
    this.hedgehog11.moveHorizontally(150, 'left', 1000);
    this.hedgehog12 = new JumpingHedgehog(this, 4950, 1120, 'hedgehog-jumper', 'hedgehog-fullbutt', true, 85);
    this.hedgehog12.moveHorizontally(100, 'left', 300);
    this.hedgehog12.jump(50, 1500);

    this.hedgehog13 = new JumpingHedgehog(this, 5860, 860, 'hedgehog-jumper', 'hedgehog-fullbutt', true, 85);
    this.hedgehog13.moveHorizontally(10, 'left', 300);
    this.hedgehog13.jump(150, 1500);
    this.hedgehog14 = new StandartHedgehog(this, 6030, 945, 'hedgehog-head', 'hedgehog-halfbutt');
    this.hedgehog14.moveHorizontally(0.1, 'left', 5000);

    this.hedgehog15 = new JumpingHedgehog(this, 6920, 1230, 'hedgehog-jumper', 'hedgehog-fullbutt', false, -100, 100);
    this.hedgehog15.jump(4, 1500);
    this.hedgehog16 = new JumpingHedgehog(this, 7520, 1265, 'hedgehog-jumper', 'hedgehog-fullbutt', false, -100, 100);
    this.hedgehog16.jump(80, 300);

    this.cursors = this.input.keyboard.createCursorKeys();
    playMusic(this);
    this.scene.run('Score');
    this.gameMenu();
  }

  addParallax() {
    this.parallax = {};
    Object.entries(parallaxImages).forEach(([key, speed]) => {
      const sprite = this.add.tileSprite(
        -50,
        -32,
        this.game.config.width + 100,
        this.game.config.height + 64,
        key,
      )
        .setOrigin(0, 0)
        .setScrollFactor(0);

      this.parallax[key] = { key, sprite, speed };
    });
  }

  setDirection(key, direction, state) {
    this[key].directions[direction] = state;
  }

  scrollParallax() {
    this.myCam = this.cameras.main;
    Object.values(this.parallax).forEach((item) => {
      const { sprite, speed } = item;
      if (speed) sprite.tilePositionX = this.cameras.main.scrollX * speed;
    });
  }

  addBackgrounds() {
    // main background
    this.background = this.add.graphics();
    this.background.fillGradientStyle(0x3C6771, 0xB3B061, 0x3C6771, 0xB3B061, 1);
    this.background.fillRect(0, 0, levelWidth, levelHeight);
    // underworld backgrounds
    gradientSquares.forEach((item, index) => {
      const {
        width,
        height,
      } = item;
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
    // const wallDefaultColor = 0x082228;
    const wallDefaultColor = 0x062C42;
    const portalColor = 0xffffff;
    const wallDefaultHeight = 16;

    walls.forEach((item) => {
      const {
        width,
        y,
        x,
        isPortal,
        isVertical,
        collisionGroup,
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
          this, wallX, wallY,
          wallWidth, wallHeight, wallColor,
          isVertical, objSettings, collisionGroup,
        );
        this.portals.push(portal);
      } else {
        const wall = this.add.rectangle(wallX, wallY, wallWidth, wallHeight, wallColor);
        const wallGameObject = this.matter.add.gameObject(wall, objSettings);
        wallGameObject.setCollisionCategory(COLLISION_CATEGORIES.wall);
      }
    });
  }

  centerCamera() {
    if (this.ibb.isAlive && this.obb.isAlive) {
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
      const camZoom = 1 - 0.05 * (charactersXDiff / cam.width);
      const closestToLeftCharacterX = ibbCoords.x > obbCoords.x ? obbCoords.x : ibbCoords.x;
      const closestToTopCharacterY = ibbCoords.y > obbCoords.y ? obbCoords.y : ibbCoords.y;
      const cameraX = parseInt(charactersXDiff / 2 + closestToLeftCharacterX, 10);
      const cameraY = parseInt(charactersYDiff / 2 + closestToTopCharacterY, 10);
      if (camZoom !== cam.zoom) cam.setZoom(camZoom);
      cam.pan(cameraX, cameraY, 100);
      this.charactersDistance = charactersXDiff;
    }
  }

  update() {
    if (this.ibb && this.obb) {
      this.centerCamera();
      this.scrollParallax();
    }
    if (this.online) this.networkSync.sync();
  }

  gameMenu() {
    this.cursors.space.on('down', () => {
      this.scene.pause('Score');
      this.scene.switch('GameMenu');
    });
  }
}
