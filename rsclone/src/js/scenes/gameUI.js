import Phaser from 'phaser';

import Create from '../components/dom-create';

import Input from '../engine/input';
import Gamepad from '../engine/gamepad';

import Score from '../components/score';

import { PLAYER_1_CONTROLS, PLAYER_2_CONTROLS } from '../constants';

export default class gameUI extends Phaser.Scene {
  constructor() {
    super('gameUI');
  }

  create(gameData) {
    const {
      parent,
      online,
      master,
      score,
      time,
    } = gameData;
    this.parent = parent;

    parent.events.off('pause', this.onPause, this);
    parent.events.on('pause', this.onPause, this);

    parent.events.off('sleep', this.onSleep, this);
    parent.events.on('sleep', this.onSleep, this);

    parent.events.off('resume', this.onResume, this);
    parent.events.on('resume', this.onResume, this);

    parent.events.off('wake', this.onWake, this);
    parent.events.on('wake', this.onWake, this);

    parent.events.off('shutdown', this.onShutdown, this);
    parent.events.on('shutdown', this.onShutdown, this);

    this.score = new Score(this, score, time);
    this.game.score = this.score;

    // Inputs & controls
    this.toggleGameMenu = this.toggleGameMenu.bind(this);
    this.toggleFullScreen = this.toggleFullScreen.bind(this);
    parent.input.keyboard.removeAllKeys();
    const escKey = parent.input.keyboard.addKey('ESC');
    escKey.on('down', this.toggleGameMenu, this);

    parent.input.keyboard.addKey('Q').on('up', () => {
      parent.events.emit('updateScore', 100);
    });

    parent.input.keyboard.addKey('E').on('up', () => {
      parent.events.emit('gameEnd', {
        score: this.score.currentScore,
        time: this.score.currentTime,
      });
    });

    parent.events.on('gameEnd', (data) => {
      console.log('data');
      parent.client.sendData('checkScore', data);
    });

    this.burger = new Create('div');
    this.burger.content = new Create('div', this.burger.node, 'game-burger');
    this.burger.x = this.game.config.width - 50;
    this.burger.y = 30;
    this.burger.spawn = this.add.dom(this.burger.x, this.burger.y, this.burger.node);
    this.burger.node.removeEventListener('click', this.toggleGameMenu, false);
    this.burger.node.addEventListener('click', this.toggleGameMenu, false);

    this.fsToggler = new Create('div');
    this.fsToggler.content = new Create('div', this.fsToggler.node, 'game-fs-toggler');
    this.fsToggler.x = this.game.config.width - 110;
    this.fsToggler.y = 30;
    this.fsToggler.spawn = this.add.dom(this.fsToggler.x, this.fsToggler.y, this.fsToggler.node);
    this.fsToggler.node.removeEventListener('click', this.toggleFullScreen, false);
    this.fsToggler.node.addEventListener('click', this.toggleFullScreen, false);

    const { desktop } = this.sys.game.device.os;
    if (online) {
      const playerKey = (master) ? 'ibb' : 'obb';
      parent.online = true;
      parent.playerKey = playerKey;
      if (desktop) {
        this.player1Input = new Input(parent, playerKey, PLAYER_1_CONTROLS);
      } else {
        this.player1Input = new Gamepad(this, parent, playerKey, 1, 'left&right');
        this.player2Input = new Gamepad(this, parent, playerKey, 2, 'up&down');
      }
      parent.network.initSync();
    } else if (desktop) {
      this.player1Input = new Input(parent, 'ibb', PLAYER_1_CONTROLS);
      this.player2Input = new Input(parent, 'obb', PLAYER_2_CONTROLS);
    } else {
      this.player1Input = new Gamepad(this, parent, 'ibb', 1);
      this.player2Input = new Gamepad(this, parent, 'obb', 2);
    }
  }

  onPause() {
    this.scene.pause();
  }

  onSleep() {
    this.scene.sleep();
  }

  onResume() {
    this.scene.resume();
  }

  onWake() {
    this.scene.wake();
  }

  onShutdown() {
    this.scene.stop();
  }

  toggleGameMenu() {
    this.parent.scene.switch('GameMenu');
  }

  toggleFullScreen() {
    const element = this.game.app.gameContainer;
    if (!document.fullscreenElement) {
      element.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}
