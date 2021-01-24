import Phaser from 'phaser';
import PhaserMatterCollisionPlugin from 'phaser-matter-collision-plugin';
import Create from './components/dom-create';

import Game from './components/game';

import { LOADING_SCENES } from './scenes/_scenesList';

import { GAME_WIDTH, GAME_HEIGHT } from './constants';

const WebFont = require('webfontloader');

class Main {
  constructor() {
    const cookieVersion = 0;
    const settings = JSON.parse(localStorage.getItem('rsc-game-settings')) || {
      locale: 'en',
      fullscreen: false,
      volume: {
        sound: 0.2,
        music: 0.1,
      },
      level: 1,
      score: 0,
      time: 0,
      cookieVersion,
    };
    const savedVersion = settings.cookieVersion;
    if (savedVersion !== cookieVersion) localStorage.clear();
    this.settings = settings;
    this.init();
  }

  init() {
    this.gameContainer = new Create('div', document.body, 'game-container').node;
    this.gameConfig = {
      type: Phaser.AUTO,
      parent: this.gameContainer,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: GAME_WIDTH,
        height: GAME_HEIGHT,
      },
      backgroundColor: '#e5e5e5',
      physics: {
        default: 'matter',
        matter: {
          enableSleeping: false,
          gravity: { y: 2 },
          debug: {
            showBody: false,
            showStaticBody: false,
          },
        },
      },
      plugins: {
        scene: [
          {
            plugin: PhaserMatterCollisionPlugin, // The plugin class
            key: 'matterCollision', // Where to store in Scene.Systems, e.g. scene.sys.matterCollision
            mapping: 'matterCollision', // Where to store in the Scene, e.g. scene.matterCollision
          },
        ],
      },
      fps: {
        target: 60,
        forceSetTimeOut: true,
      },
      scene: LOADING_SCENES,
      dom: { createContainer: true },
    };

    this.game = new Game(this, this.gameConfig);
  }

  saveSettings() {
    localStorage.setItem('rsc-game-settings', JSON.stringify(this.settings));
  }
}

WebFont.load({
  google: { families: ['Montserrat'] },
});

const main = new Main();
window.main = main;
