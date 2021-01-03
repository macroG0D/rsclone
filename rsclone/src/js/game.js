import Phaser from 'phaser';
import ibbSprite from '../assets/ibb/ibb-sprite.png';
import obbSprite from '../assets/obb/obb-sprite.png';

export default class MyGame extends Phaser.Scene {
  preload() {
    this.load.spritesheet('ibb-sprite', ibbSprite, { frameWidth: 47, frameHeight: 53 });
    this.load.spritesheet('obb-sprite', obbSprite, { frameWidth: 47, frameHeight: 64 });
  }

  create() {
    this.physics.world.setBounds(0, 0, 6090, 890);
    this.cameras.main.setBounds(0, 0, 6090, 890);
    this.cameras.main.roundPixels = true;
    this.addControlKeys();
    this.addPlayer('ibb', [300, 0], 'ibb-sprite');
    this.addPlayer('obb', [600, 0], 'obb-sprite');
    this.addWall();
    this.initCamera();
    this.addCollisions();
  }

  update() {
    this.bindPlayerControls('ibb', this.cursors);
    this.bindPlayerControls('obb', this.wasd);
    this.centerCamera();
  }

  addWall() {
    this.wall = this.add.rectangle(0, 600, 1700, 20, 0xffffff);
    this.wall.setOrigin(0, 0);
    this.physics.add.existing(this.wall);
    this.wall.body.setAllowGravity(false);
    this.wall.body.setImmovable(true);
  }

  addPlayer(characterKey, position, spriteName) {
    const [x, y] = position;
    this[characterKey] = this.physics.add.sprite(x, y, spriteName);
    this[characterKey].setCollideWorldBounds(true);
    this.createPlayerAnimations(characterKey, spriteName);
  }

  createPlayerAnimations(characterKey, spriteName) {
    this.anims.create({
      key: `move-${characterKey}`,
      frames: this.game.anims.generateFrameNumbers(spriteName),
      frameRate: 31,
      repeat: -1,
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
    this.physics.add.collider(this.ibb, this.wall);
    this.physics.add.collider(this.obb, this.wall);
    this.physics.add.collider(this.ibb, this.obb);
    this.cameraWalls.forEach((cameraWall) => {
      this.physics.add.collider(this.ibb, cameraWall);
      this.physics.add.collider(this.obb, cameraWall);
    });
  }

  bindPlayerControls(characterKey, controls, playerSpeed = 200) {
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
      /*
      if (this.player.anims.currentAnim && !this.player.anims.currentAnim.paused && this.player.anims.currentAnim.key === 'move') {
        this.player.anims.currentAnim.pause();
        const stopFrame = this.player.anims.currentFrame.index;
        const totalFrames = this.player.anims.currentAnim.frameRate;
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
    const rightWall = this.createRectangle(gameDimensions.width - wallThickness, 0, wallThickness, gameDimensions.width);
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
    const cameraX = parseInt(charactersXDiff / 2 + (ibbCoord.x > obbCoord.x ? obbCoord.x : ibbCoord.x), 10);
    const cameraY = parseInt(charactersYDiff / 2 + (ibbCoord.y > obbCoord.y ? obbCoord.y : ibbCoord.y), 10);
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
}
