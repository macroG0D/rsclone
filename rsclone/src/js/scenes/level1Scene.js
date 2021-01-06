import Phaser from 'phaser';
import Player from '../sprites/player';
import { gradientSquares, gradientColors, walls } from '../levels/level1/backgroundStructure';

const levelWidth = 5369;
const levelHeight = 890;

export default class Level1Scene extends Phaser.Scene {
  constructor() {
    super('Level1');
  }

  create() {
    this.physics.world.setBounds(0, 0, levelWidth, levelHeight);
    this.cameras.main.setBounds(0, 0, levelWidth, levelHeight);
    this.cameras.main.roundPixels = true;
    this.addBackgrounds();
    this.addControlKeys();
    this.ibb = new Player(this, 'ibb', 300, 0, 'ibb-sprite');
    this.obb = new Player(this, 'obb', 600, 0, 'obb-sprite');
    this.addWalls();
    this.initCamera();
    this.addCollisions();
    this.music = this.sound.add('level1_music');
    this.music.play({ loop: true });
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
      const wall = this.add.rectangle(x, top, wallWidth, wallHeight, wallColor);
      wall.setOrigin(0, 0);
      this.physics.add.existing(wall);
      wall.body.setAllowGravity(false);
      wall.body.setImmovable(true);
      if (isPortal) {
        this.portals.push(wall);
      } else {
        this.walls.push(wall);
      }
    });
  }

  addControlKeys() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = {
      up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };
  }

  addCollisions() {
    this.physics.add.collider(this.ibb, this.obb);
    this.walls.forEach((wall) => {
      this.physics.add.collider(this.ibb, wall);
      this.physics.add.collider(this.obb, wall);
    });
    this.cameraWalls.forEach((cameraWall) => {
      this.physics.add.collider(this.ibb, cameraWall);
      this.physics.add.collider(this.obb, cameraWall);
    });
  }

  bindPlayerControls(characterKey, controls, playerSpeed = 300) {
    if (controls.left.isDown) {
      this[characterKey].setVelocityX(-playerSpeed);
      this[characterKey].anims.play(`move-${characterKey}`, true);
      this[characterKey].flipX = true;
    } else if (controls.right.isDown) {
      this[characterKey].setVelocityX(playerSpeed);
      this[characterKey].anims.play(`move-${characterKey}`, true);
      this[characterKey].flipX = false;
    } else {
      this[characterKey].setVelocityX(0);
      this[characterKey].anims.stop();
      if (this[characterKey].anims.currentAnim) {
        this[characterKey].anims.setCurrentFrame(this[characterKey].anims.currentAnim.frames[0]);
      }
      // theoretical approach to finish animation after player stops
      /*
      const currAnim = this.player.anims.currentAnim;
      if (currAnim && !currAnim.paused && currAnim.key === 'move') {
        currAnim.pause();
        const stopFrame = this.player.anims.currentFrame.index;
        const totalFrames = currAnim.frameRate;
        this.anims.create({
          key: 'stop',
          frames: this.anims.generateFrameNumbers('ibb-sprite', { start: 0, end: 15 }),
          frameRate: totalFrames - stopFrame,
          repeat: 1,
        });
        this.player.anims.play('stop');
        this.player.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
          console.log('complete');
        }, this);
      }
      */
    }
    if ((controls.up.isDown || controls.down.isDown) && this[characterKey].body.touching.down) {
      this[characterKey].setVelocityY(-250);
    }
  }

  createRectangle(x, y, width, height) {
    const rect = this.add.rectangle(x, y, width, height);
    rect.setOrigin(0, 0);
    this.physics.add.existing(rect);
    rect.body.setAllowGravity(false);
    rect.body.setImmovable(true);
    rect.setScrollFactor(0);
    return rect;
  }

  initCamera() {
    this.cameraWalls = [];
    const wallThickness = 2;
    const gameDimensions = { width: this.game.config.width, height: this.game.config.height };
    const leftWall = this.createRectangle(0, 0, wallThickness, gameDimensions.width);
    const rightWallPosX = gameDimensions.width - wallThickness;
    const rightWall = this.createRectangle(rightWallPosX, 0, wallThickness, gameDimensions.width);
    this.cameraWalls.push(leftWall);
    this.cameraWalls.push(rightWall);
  }

  centerCamera() {
    const cam = this.cameras.main;
    const ibbCoord = { x: this.ibb.x, y: this.ibb.y };
    const obbCoord = { x: this.obb.x, y: this.obb.y };
    const charactersXDiff = Math.abs(obbCoord.x - ibbCoord.x);
    const charactersYDiff = Math.abs(obbCoord.y - ibbCoord.y);
    const zoomCoef = charactersXDiff / cam.width;
    const camZoom = 1 - 0.2 * zoomCoef;
    const closestToLeftCharacterX = ibbCoord.x > obbCoord.x ? obbCoord.x : ibbCoord.x;
    const closestToTopCharacterY = ibbCoord.y > obbCoord.y ? obbCoord.y : ibbCoord.y;
    const cameraX = parseInt(charactersXDiff / 2 + closestToLeftCharacterX, 10);
    const cameraY = parseInt(charactersYDiff / 2 + closestToTopCharacterY, 10);
    if (camZoom !== cam.zoom) {
      cam.setZoom(camZoom);
    }
    if (cameraX !== this.cameras.main.midPoint.x) {
      cam.centerOnX(cameraX);
      this.cameraWalls[0].setX(cam.scrollX);
      this.cameraWalls[1].setX(cam.scrollX + cam.width);
    }
    if (cameraY !== cam.midPoint.Y) {
      cam.centerOnY(cameraY);
    }
  }

  update() {
    this.bindPlayerControls('ibb', this.cursors);
    this.bindPlayerControls('obb', this.wasd);
    this.centerCamera();
  }
}
