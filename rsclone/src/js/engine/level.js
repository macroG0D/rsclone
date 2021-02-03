import LevelObject from '../components/levelObject';
import Enemy from '../components/enemy';

import Player from '../sprites/player';
import Portal from '../sprites/portal';

import LevelEnd from './levelEnd';

import { LEVELS } from '../levels/levels';
import {
  BORDER_THICKNESS,
  COLLISION_CATEGORIES,
  GAME_WIDTH,
  GAME_HEIGHT,
} from '../constants';

export default class Level {
  constructor(scene, wallsColor) {
    const { key } = scene.scene;
    this.key = key;
    this.scene = scene;
    this.config = LEVELS[key];
    this.config.parallax = LEVELS[key];
    this.walls = [];
    this.portals = [];
    this.camPoints = {};
    this.wallsColor = wallsColor;
    this.init();
  }

  init() {
    const { width, height } = this.config;
    const { scene } = this;
    scene.matter.world.setBounds(0, 0, width, height, BORDER_THICKNESS);
    scene.cameras.main.setBounds(0, 0, width, width);
    scene.cameras.main.roundPixels = true;
    this.addParallax();
    this.addWalls();
    this.addWorldBounds();
    this.addLevelEntourage();
  }

  postInit() {
    const { end } = this.config;
    const { scene } = this;
    this.spawnEnemies();
    this.spawnPlayers();
    this.levelEnd = new LevelEnd(scene, end.x, end.y);
    scene.events.off('GameOver');
    scene.events.on('GameOver', this.gameOver, this);
    scene.events.off('update', this.onUpdate, this);
    scene.events.on('update', this.onUpdate, this);
  }

  gameOver() {
    this.scene.time.addEvent({
      delay: 2500,
      callback: () => this.scene.scene.start('GameOver'),
    });
  }

  spawnEnemies() {
    const { scene } = this;
    const { enemies } = this.config;
    enemies.forEach((item) => {
      const enemyItem = item[0];
      const enemyMethods = item.slice(1) || [];
      const key = enemyItem[0];
      const props = enemyItem.slice(1);
      const enemy = new Enemy(key, scene, ...props);
      enemyMethods.forEach((methodItem) => {
        const methodName = methodItem[0];
        const methodProps = methodItem.slice(1) || [];
        const method = enemy[methodName];
        if (method) method.apply(enemy, methodProps);
      });
    });
  }

  spawnPlayers() {
    const { scene } = this;
    const { spawn } = this.config;
    this.ibb = new Player(scene, 'ibb', spawn.ibb.x, spawn.ibb.y, 'ibb-sprite', COLLISION_CATEGORIES.ibb);
    this.obb = new Player(scene, 'obb', spawn.obb.x, spawn.obb.y, 'obb-sprite', COLLISION_CATEGORIES.obb);
    this.ibb.headStandingCheck();
    this.obb.headStandingCheck();
  }

  addParallax() {
    const { scene } = this;
    const { parallaxImages } = this.config.parallax;
    scene.parallax = {};
    Object.entries(parallaxImages).forEach(([key, speed]) => {
      const sprite = scene.add.tileSprite(
        -50,
        -32,
        scene.game.config.width + 100,
        scene.game.config.height + 64,
        key,
      )
        .setOrigin(0, 0)
        .setScrollFactor(0);

      scene.parallax[key] = { key, sprite, speed };
    });
  }

  addWalls() {
    const { scene } = this;
    const { walls } = this.config;
    const wallDefaultColor = this.wallsColor;
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
        slop: -1,
      };
      if (isPortal) {
        // moved portal to separate class for better detection in collision event with instanceof
        const portal = new Portal(
          scene, wallX, wallY,
          wallWidth, wallHeight, wallColor,
          isVertical, objSettings, collisionGroup,
        );
        this.portals.push(portal);
      } else {
        const wall = scene.add.rectangle(wallX, wallY, wallWidth, wallHeight, wallColor);
        const wallGameObject = scene.matter.add.gameObject(wall, objSettings);
        wallGameObject.setCollisionCategory(COLLISION_CATEGORIES.wall);
      }
    });
  }

  addWorldBounds() {
    this.addSpikes();
    this.addSpikesSensors();
  }

  addSpikes() {
    const { scene } = this;
    const { width, height } = this.config;
    this.spikes = [];
    const spikeWidth = 88;
    let spikeCount = 0;
    const spikeYCorrection = 24;
    const spikeXCorrection = 22;
    const radianValue = 6.28319;
    let spikeX = 0;
    const matterParams = { isSensor: true, isStatic: true };
    do {
      spikeX = (spikeWidth - spikeXCorrection) * spikeCount;
      const topSpike = scene.add.image(spikeX, 0 - spikeYCorrection, 'spikes', null, matterParams);
      const bottomSpike = scene.add.image(spikeX, height + spikeYCorrection, 'spikes', null, matterParams);
      this.spikes.push(topSpike, bottomSpike);
      scene.tweens.add({
        targets: [topSpike, bottomSpike],
        paused: false,
        rotation: spikeCount % 2 === 0 ? -radianValue : radianValue,
        duration: 1000,
        repeat: -1,
      });
      spikeCount += 1;
    } while (spikeX < width);
  }

  addSpikesSensors() {
    const { scene } = this;
    const { width, height } = this.config;
    const sensorHeight = 20;
    this.spikesSensors = [];
    const matterParams = { isSensor: true, isStatic: true };
    const topSensor = scene.matter.add.rectangle(
      width / 2, sensorHeight / 2, width,
      sensorHeight, matterParams,
    );
    const bottomSensor = scene.matter.add.rectangle(
      width / 2, height - sensorHeight / 2, width,
      sensorHeight, matterParams,
    );
    this.spikesSensors.push(topSensor, bottomSensor);
  }

  addLevelEntourage() {
    const { scene } = this;
    const { entourage } = this.config;
    Object.entries(entourage).forEach(([key, items]) => {
      items.forEach((props) => new LevelObject(key, scene, ...props));
    });
  }

  centerCamera() {
    const { scene } = this;
    if (!this.ibb.body || !this.obb.body) return;
    if (this.ibb.isAlive) {
      this.camPoints.ibb = {
        x: this.ibb.x,
        y: this.ibb.y,
      };
    }

    if (this.obb.isAlive) {
      this.camPoints.obb = {
        x: this.obb.x,
        y: this.obb.y,
      };
    }

    const cam = scene.cameras.main;
    const ibbCoords = {
      x: this.camPoints.ibb.x,
      y: this.camPoints.ibb.y,
    };
    const obbCoords = {
      x: this.camPoints.obb.x,
      y: this.camPoints.obb.y,
    };
    const charactersXDiff = Math.abs(obbCoords.x - ibbCoords.x);
    const charactersYDiff = Math.abs(obbCoords.y - ibbCoords.y);
    const camZoom = 1 - 0.05 * (charactersXDiff / cam.width);
    const closestToLeftCharacterX = ibbCoords.x > obbCoords.x ? obbCoords.x : ibbCoords.x;
    const closestToTopCharacterY = ibbCoords.y > obbCoords.y ? obbCoords.y : ibbCoords.y;
    const cameraX = parseInt(charactersXDiff / 2 + closestToLeftCharacterX, 10);
    const cameraY = parseInt(charactersYDiff / 2 + closestToTopCharacterY, 10);
    if (charactersXDiff < GAME_WIDTH && charactersYDiff < GAME_HEIGHT) {
      if (camZoom !== cam.zoom) cam.setZoom(camZoom);
      cam.pan(cameraX, cameraY, 100);
    }
  }

  setDirection(key, direction, state) {
    this[key].directions[direction] = state;
  }

  scrollParallax() {
    const { scene } = this;
    scene.myCam = scene.cameras.main;
    Object.values(scene.parallax).forEach((item) => {
      const { sprite, speed } = item;
      if (speed) sprite.tilePositionX = scene.cameras.main.scrollX * speed;
    });
  }

  checkLevelEnd() {
    if (this.ibb.atLevelFinish && this.obb.atLevelFinish && !this.isFinished) {
      this.isFinished = true;
      if (this.scene.game.level === 1) {
        this.levelEnd.completeLevel();
        return;
      }
      const score = this.scene.game.score.currentScore;
      const time = this.scene.game.score.currentTime;
      const gameData = { score, time };
      this.scene.game.level = 1;
      this.scene.game.app.settings.level = 1;
      this.scene.game.app.settings.score = 0;
      this.scene.game.app.settings.time = 0;
      this.scene.game.app.saveSettings();
      this.scene.client.sendData('checkScore', gameData);
    }
  }

  onUpdate() {
    if (!this.scene.game.isStarted) this.scene.game.isStarted = true;
    if (this.ibb && this.obb) {
      this.centerCamera();
      this.scrollParallax();
      this.checkLevelEnd();
    }
  }
}
