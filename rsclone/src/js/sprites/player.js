import Phaser from 'phaser';
import Death from './death';

import {
  DEFAULT_MASS,
  DEFAULT_FRICTION,
  DEFAULT_FRICTION_AIR,
  CHARACTERS_DISTANCE_MAX,
  PARTICLES_COLORS,
} from '../constants';

import { playSound, playWalkSound } from '../utils/playSound';

function createPlayerAnimations(scene, key, sprite) {
  const { anims } = scene;
  anims.create({
    key: `idle-${key}`,
    frames: anims.generateFrameNumbers(sprite, { start: 0, end: 217 }),
    frameRate: 60,
    repeat: -1,
  });
  anims.create({
    key: `move-${key}`,
    frames: anims.generateFrameNumbers(sprite, { start: 218, end: 254 }),
    frameRate: 60,
    repeat: -1,
  });
  anims.create({
    key: `jump-${key}`,
    frames: anims.generateFrameNumbers(sprite, { start: 255, end: 316 }),
    frameRate: 60,
    repeat: -1,
  });
}
export default class Player extends Phaser.Physics.Matter.Sprite {
  constructor(scene, key, x, y, sprite, collisionCategory) {
    super(scene.matter.world, x, y, sprite);
    this.scene = scene;
    createPlayerAnimations(scene, key, sprite);
    this.moving = false;
    this.directions = {
      up: false,
      down: false,
      left: false,
      right: false,
    };
    this.portals = scene.level.portals;
    this.isAlive = true;
    this.key = key;
    this.isGrounded = false;
    this.isCarrying = false;
    this.isHeadStanding = false;
    this.isRotated = false;
    this.canJump = true;
    this.lockVelocity = true;
    this.atLevelFinish = false;
    this.depth = this.key === 'ibb' ? 99 : 97; // z index
    const { Body, Bodies } = Phaser.Physics.Matter.Matter;
    const { width: w, height: h } = this;
    const mainBody = Bodies.rectangle(0, 0, w * 0.75, h * 0.96, { chamfer: { radius: 8 } });
    this.sensors = {
      center: Bodies.rectangle(0, 0, 1, 1, { label: 'body-center', isSensor: true }),
      top: Bodies.rectangle(0, h - h * 1.48, w * 0.5, 5, { label: 'body-top', isSensor: true }),
      bottom: Bodies.rectangle(0, h * 0.48, w * 0.5, 5, { label: 'body-bottom', isSensor: true }),
      left: Bodies.rectangle(-w * 0.45, 0, 5, h * 0.4, { label: 'body-left', isSensor: true }),
      right: Bodies.rectangle(w * 0.45, 0, 5, h * 0.4, { label: 'body-right', isSensor: true }),
    };

    const compoundBody = Body.create({
      parts: [
        mainBody,
        this.sensors.center,
        this.sensors.top,
        this.sensors.bottom,
        this.sensors.left,
        this.sensors.right,
      ],
      frictionAir: DEFAULT_FRICTION_AIR,
      friction: DEFAULT_FRICTION,
      mass: DEFAULT_MASS,
    });
    this
      .setExistingBody(compoundBody)
      .setFixedRotation() // disable spin around its mass center point
      .setPosition(x, y);

    this.jumpVelocity = 14; // jump velocity moved to player class
    this.disableGravitySwitch = false; // additional flag
    this.scene.add.existing(this);
    this.scene.events.off('update', this.update, this);
    this.scene.events.on('update', this.update, this);

    // Track which sensors are touching something
    this.isTouching = {
      left: false,
      right: false,
      top: false,
      bottom: false,
      center: false,
    };

    // Before matter's update, reset record of what surfaces the player is touching.
    scene.matter.world.on('beforeupdate', this.resetTouching, this);

    // If a sensor just started colliding with something, or it continues to collide with something,
    // call onSensorCollide
    scene.matterCollision.addOnCollideStart({
      objectA: [this.sensors.bottom, this.sensors.top, this.sensors.left, this.sensors.right],
      callback: this.onSensorCollide,
      context: this,
    });

    scene.matterCollision.addOnCollideActive({
      objectA: [this.sensors.bottom, this.sensors.top, this.sensors.left, this.sensors.right],
      callback: this.onSensorCollide,
      context: this,
    });
    this.portals.forEach((currPortal) => {
      const portal = currPortal;
      if (!portal.sensorCache) portal.sensorCache = {};
      const cache = portal.sensorCache;
      if (!cache[this.key]) cache[this.key] = '';
      this.portalsListeners(scene, portal);
    });
    this.body.restitution = 0.3;
    this.setCollisionCategory(collisionCategory);

    this.landingEvent();
    this.addCollideWorldBoundsListener();
  }

  toggleFinishState() {
    this.atLevelFinish = !this.atLevelFinish;
  }

  playerGlow() {
    const color = Phaser.Display.Color.IntegerToRGB((PARTICLES_COLORS[this.key][2]));
    const light = this.scene.add.pointlight(
      this.body.position.x, this.body.position.y, 0, this.width / 1.1, 0.075,
    );
    light.depth = 1;
    light.color.setTo(color.r, color.g, color.b);
    this.scene.time.addEvent({
      delay: 10,
      callback: () => {
        light.destroy();
      },
    });
  }

  getAnotherPlayer() {
    const anotherPlayerKey = this.key === 'ibb' ? 'obb' : 'ibb';
    return this.scene.level[anotherPlayerKey];
  }

  addCollideWorldBoundsListener() {
    const worldBounds = this.scene.level.spikesSensors;
    this.scene.matterCollision.addOnCollideStart({
      objectA: worldBounds,
      objectB: this,
      callback: this.kill,
      context: this,
    });
  }

  kill(pair) {
    if (pair.gameObjectB && (pair.gameObjectB.key === 'ibb' || pair.gameObjectB.key === 'obb') && pair.gameObjectB.isAlive) {
      const player = pair.gameObjectB;
      player.isAlive = false;
      Death.deathAnimation(this.scene, player, 'player');
      this.scene.time.addEvent({
        delay: 500,
        callback: () => {
          const anotherPlayerKey = player.key === 'ibb' ? 'obb' : 'ibb';
          if (this.scene.level[anotherPlayerKey].isAlive) {
            this.scene.level[anotherPlayerKey].isAlive = false;
            Death.deathAnimation(this.scene, this.scene.level[anotherPlayerKey], 'player');
          }
        },
      });
    }
  }

  isOnHead() {
    this.isHeadStanding = true;
    this.depth = 97;
    this.getAnotherPlayer().isCarrying = true;
    this.getAnotherPlayer().depth = 99;
  }

  isNotOnHead() {
    this.isHeadStanding = false;
    this.getAnotherPlayer().isCarrying = false;
  }

  // check if one player is standing on the second's head and update their statuses
  headStandingCheck() {
    this.scene.matterCollision.addOnCollideStart({
      objectA: this.sensors.bottom,
      objectB: this.getAnotherPlayer().sensors.top,
      callback: this.isOnHead,
      context: this,
    });
    this.scene.matterCollision.addOnCollideEnd({
      objectA: this.sensors.bottom,
      objectB: this.getAnotherPlayer().sensors.top,
      callback: this.isNotOnHead,
      context: this,
    });
  }

  landingEvent() {
    this.scene.matterCollision.addOnCollideStart({
      objectA: this.sensors.bottom,
      callback: () => { playSound(this.scene, 'popbase'); },
      context: this,
    });
  }

  onSensorCollide({ bodyA, bodyB, pair }) { // may use pair as third argument
    if (bodyB.isSensor) return; // We only care about collisions with physical objects
    if (bodyA === this.sensors.left) {
      this.isTouching.left = true;
      if (pair.separation > 3) this.x += (this.isRotated) ? -3 : 3;
    }
    if (bodyA === this.sensors.right) {
      this.isTouching.right = true;
      if (pair.separation > 3) this.x += (this.isRotated) ? 3 : -3;
    }
    if (bodyA === this.sensors.top) this.isTouching.top = true;
    if (bodyA === this.sensors.bottom) this.isTouching.bottom = true;
  }

  resetTouching() {
    this.isTouching.left = false;
    this.isTouching.right = false;
    this.isTouching.top = false;
    this.isTouching.bottom = false;
    this.isTouching.center = false;
  }

  portalsListeners(scene, portal) {
    scene.matterCollision.addOnCollideEnd({
      objectA: [
        this.sensors.left,
        this.sensors.right,
        this.sensors.top,
        this.sensors.bottom,
      ],
      objectB: portal,
      callback: (eventData) => {
        const sensor = eventData.bodyA;
        const player = eventData.gameObjectA;
        this.PortalDiveCheck(sensor, player, portal);
      },
      context: this,
    });
  }

  PortalDiveCheck(sensor, player, portal) {
    const cache = portal.sensorCache;
    const { label } = sensor;
    if (label === 'body-center') return;
    const prevSensor = cache[player.key];
    if (prevSensor !== label) {
      if (portal.isVertical && (label === 'body-top' || label === 'body-bottom')) return;
      if (!portal.isVertical && (label === 'body-left' || label === 'body-right')) return;
      if (!prevSensor) {
        cache[player.key] = label;
        return;
      }
      this.portalDive(portal);
    }
  }

  portalDive(portal) {
    portal.emitParticles(
      this.x, this.y,
      this.width, this.height,
      this.body.velocity,
      this.isRotated,
    );
    this.scene.time.addEvent({
      delay: 10,
      callback: () => {
        playSound(this.scene, 'warp_cross');
        this.switchGravity(portal.isVertical);
      },
    });
  }

  rotatePlayer() {
    this.angle = (this.isRotated) ? 0 : 180;
    this.isRotated = !this.isRotated;
    this.turnCharacter();
  }

  turnCharacter() {
    const checkDirection = (this.isRotated) ? 'right' : 'left';
    this.setFlipX(this.direction === checkDirection);
  }

  switchGravity(isVertical) {
    const verticalVelocityForce = 0;
    const minVelocity = isVertical ? verticalVelocityForce : this.jumpVelocity;
    const currVelocity = Math.abs(isVertical ? this.body.velocity.x : this.body.velocity.y);
    /* adding additional velocity to players body so that player velocity wont fade out if he will
    be constantly jumping through portal
    */
    if (currVelocity < minVelocity) {
      if (isVertical) {
        this.lockVelocity = false;
        this.setVelocityX(this.isRotated ? -minVelocity : minVelocity);
        this.scene.time.addEvent({
          delay: 30,
          callback: () => { this.lockVelocity = true; },
        });
      } else {
        this.setVelocityY(this.isRotated ? -minVelocity : minVelocity);
      }
    }
    this.body.gravityScale.y *= -1; // flip gravity
    this.rotatePlayer(); // rotate character
  }

  movePlayer() {
    if (!this.isAlive) return;
    const currentVelocity = this.body.velocity;
    const maxVelocity = 2;
    /* left/right move */
    if (this.directions.left) this.moveCharacter('left');
    if (this.directions.right) this.moveCharacter('right');

    if (this.lockVelocity) {
      /* limit velocity after applying force, so that the characters wont speed up infinitely */
      if (currentVelocity.x > maxVelocity) this.setVelocityX(maxVelocity);
      if (currentVelocity.x < -maxVelocity) this.setVelocityX(-maxVelocity);
    }
    /* jump */
    if ((this.directions.up || this.directions.down) && this.isGrounded && this.canJump) {
      this.setVelocityY((this.isRotated) ? this.jumpVelocity : -this.jumpVelocity);
      if (this.isCarrying) {
        Phaser.Physics.Matter.Matter.Body.setVelocity(this.getAnotherPlayer().body, {
          x: this.body.velocity.x,
          y: this.body.velocity.y,
        });
      }
      this.canJump = false;
      playSound(this.scene, 'popbase');
      this.scene.time.addEvent({
        delay: 700,
        callback: () => { this.canJump = true; },
      });
    }
  }

  moveCharacter(direction) {
    const moveForce = 0.015;
    const force = (direction === 'right') ? moveForce : -moveForce;
    if (this.canMove(direction)) {
      this.applyForce({ x: force, y: 0 });
      if (this.isGrounded) playWalkSound(this.scene, this.key);
    }
    if (this.isCarrying) this.getAnotherPlayer().applyForce({ x: force, y: 0 });
    this.direction = direction;
    this.turnCharacter();
    this.anims.play(`move-${this.key}`, true);
  }

  canMove(direction) {
    const anotherPlayer = this.getAnotherPlayer();
    const charactersDistance = Math.abs(this.x - anotherPlayer.x);
    if (direction === 'left' && this.x <= anotherPlayer.x) return (charactersDistance < CHARACTERS_DISTANCE_MAX);
    if (direction === 'right' && this.x >= anotherPlayer.x) return (charactersDistance < CHARACTERS_DISTANCE_MAX);
    return true;
  }

  update() {
    if (this.scene && this.isAlive) {
      this.isGrounded = this.isTouching.bottom;
      this.movePlayer();
      this.playerGlow();
      if (this.isGrounded && this.body.force.x === 0) this.anims.play(`idle-${this.key}`, true);
      if (!this.isGrounded && this.body.force.x === 0) this.anims.play(`jump-${this.key}`, true);
      if (this.isHeadStanding && !this.getAnotherPlayer().isGrounded) this.anims.play(`jump-${this.key}`, true);
    }
  }
}
