import Phaser from 'phaser';
import Player from '../sprites/player';
import Portal from '../sprites/portal';
import { gradientSquares, gradientColors, walls } from '../levels/level1/backgroundStructure';

const levelWidth = 5369;
const levelHeight = 890;

export default class Level1Scene extends Phaser.Scene {
  constructor() {
    super('Level1');
  }

  create() {
    this.matter.world.setBounds(0, 0, levelWidth, levelHeight, 32, true, true, false, true);
    this.cameras.main.setBounds(0, 0, levelWidth, levelHeight);
    this.cameras.main.roundPixels = true;
    this.addBackgrounds();
    this.addWalls();
    this.addControlKeys();
    this.ibb = new Player(this, 'ibb', 200, 200, 'ibb-sprite');
    this.obb = new Player(this, 'obb', 300, 300, 'obb-sprite');
    this.initCamera();
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

  bindPlayerControls(characterKey, controls) {
    const character = this[characterKey];
    const currentVelocity = character.body.velocity;
    const maxVelocityX = 2;
    const moveForce = 0.01;
    const { isOnGround, jumpVelocity } = character;
    /* left/right move */
    function moveCharacter(direction) {
      const force = direction === 'right' ? moveForce : -moveForce;
      const shouldFlip = direction !== 'right';
      character.setFlipX(shouldFlip); // flipping character sprite
      character.applyForce({ x: force, y: 0 }); // applying force to character
      character.anims.play(`move-${characterKey}`, true); // playing move animation
    }
    if (controls.left.isDown) {
      moveCharacter('left');
    } else if (controls.right.isDown) {
      moveCharacter('right');
    } else {
      character.anims.stop();
      if (character.anims.currentAnim) {
        character.anims.setCurrentFrame(character.anims.currentAnim.frames[0]);
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
    /* limit velocity after applying force, so that the characters wont speed up infinitely */
    if (currentVelocity.x > maxVelocityX) {
      character.setVelocityX(maxVelocityX);
    } else if (currentVelocity.x < -maxVelocityX) {
      character.setVelocityX(-maxVelocityX);
    }
    /* jump */
    if ((controls.up.isDown || controls.down.isDown) && isOnGround) {
      character.isOnGround = false;
      // change jump velocity direction if player is flipped = undergroud
      character.setVelocityY(character.flipY ? jumpVelocity : -jumpVelocity);
    }
  }

  createCameraWall(x, y, width, height) {
    // these and other options should be configured for proper physic behaviour, commented for now
    const objSettings = {
      isStatic: true,
    };
    const rect = this.add.rectangle(x, y, width, height);
    const matterRect = this.matter.add.gameObject(rect, objSettings);
    matterRect.setMass(0.0001);
    return rect;
  }

  initCamera() {
    this.cameraWalls = [];
    const wallThickness = 2;
    const gameDimensions = { width: this.game.config.width, height: this.game.config.height };
    const y = gameDimensions.height / 2;
    const leftWall = this.createCameraWall(0, y, wallThickness, gameDimensions.height);
    const rightWallPosX = gameDimensions.width - wallThickness;
    const rightWall = this.createCameraWall(rightWallPosX, y, wallThickness, gameDimensions.height);
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
