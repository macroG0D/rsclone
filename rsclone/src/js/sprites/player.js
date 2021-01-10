import Phaser from 'phaser';

import { CONTROL_KEYS_SEQUENCE, CHARACTERS_DISTANCE_MAX } from '../constants';

function createPlayerAnimations(scene, key, sprite) {
  scene.anims.create({
    key: `move-${key}`,
    frames: scene.game.anims.generateFrameNumbers(sprite),
    frameRate: 31,
    repeat: -1,
  });
}
export default class Player extends Phaser.Physics.Matter.Sprite {
  constructor(scene, key, x, y, sprite, controls) {
    const DEFAULT_MASS = 1; // number is random right now, can(should?) be changed later
    super(scene.matter.world, x, y, sprite);
    this.scene = scene;
    this.key = key;
    this.sprite = sprite;
    createPlayerAnimations(this.scene, this.key, this.sprite);
    this.setFixedRotation(); // disable spin around its mass center point
    this.setMass(DEFAULT_MASS);
    this.jumpVelocity = 9; // jump velocity moved to player class
    this.disableGravitySwitch = false; // additional flag
    this.scene.add.existing(this);

    this.controls = {};
    controls.forEach((controlKey, controlIndex) => {
      const direction = CONTROL_KEYS_SEQUENCE[controlIndex];
      this.controls[direction] = this.scene
        .input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[controlKey]);
    });
    this.scene.events.on('update', this.update, this);
  }

  switchGravity() {
    if (!this.disableGravitySwitch) {
      const minVelocity = this.jumpVelocity;
      const currVelocity = Math.abs(this.body.velocity.y);
      /* adding additional velocity to players body so that player velocity wont fade out if he will
      be constantly jumping through portal
      */
      if (currVelocity < minVelocity) this.setVelocityY(this.flipY ? -minVelocity : minVelocity);
      this.disableGravitySwitch = true; // toggle flag
      this.body.gravityScale.y *= -1; // flip gravity
      this.setFlipY(!this.flipY); // flip character sprite
      /* because we are triggering switch gravity in interval(read comment in collision event
      description), this event can be triggered multiple times in a row. To avoid it we added
      flag that disables multiple gravitySwitch calls for 100ms */
      setTimeout(() => {
        this.disableGravitySwitch = false;
      }, 100);
    }
  }

  update() {
    this.movePlayer();
  }

  movePlayer() {
    console.log(this);
    console.log(this.body);
    const currentVelocity = this.body.velocity;
    const maxVelocity = 2;
    /* left/right move */
    if (this.controls.left.isDown) this.moveCharacter('left');
    if (this.controls.right.isDown) this.moveCharacter('right');
    if (!this.controls.left.isDown && !this.controls.right.isDown) {
      this.anims.stop();
      if (this.anims.currentAnim) this.anims.setCurrentFrame(this.anims.currentAnim.frames[0]);
    }
    /* limit velocity after applying force, so that the characters wont speed up infinitely */
    if (currentVelocity.x > maxVelocity) this.setVelocityX(maxVelocity);
    if (currentVelocity.x < -maxVelocity) this.setVelocityX(-maxVelocity);
    /* jump */
    if ((this.controls.up.isDown || this.controls.down.isDown) && this.isOnGround) {
      this.isOnGround = false;
      this.setVelocityY(-this.jumpVelocity);
    }
  }

  moveCharacter(direction) {
    const moveForce = 0.01;
    const force = direction === 'right' ? moveForce : -moveForce;
    const shouldFlip = direction !== 'right';
    this.setFlipX(shouldFlip); // flipping character sprite
    if (this.canMove(direction)) this.applyForce({ x: force, y: 0 });
    this.anims.play(`move-${this.key}`, true); // playing move animation
  }

  canMove(direction) {
    const thisPlayer = (this.key === 'ibb') ? this.scene.ibb : this.scene.obb;
    const anotherPlayer = (this.key === 'ibb') ? this.scene.obb : this.scene.ibb;
    const charactersDistance = Math.abs(thisPlayer.x - anotherPlayer.x);
    if (direction === 'left' && thisPlayer.x <= anotherPlayer.x) return (charactersDistance < CHARACTERS_DISTANCE_MAX);
    if (direction === 'right' && thisPlayer.x >= anotherPlayer.x) return (charactersDistance < CHARACTERS_DISTANCE_MAX);
    return true;
  }
}
