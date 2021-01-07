import Phaser from 'phaser';
import Create from './components/dom-create';

import { SCENE_LIST } from './scenes/_scenesList';

import { GAME_WIDTH, GAME_HEIGHT } from './constants';

const WebFont = require('webfontloader');

class Main {
  constructor() {
    const cookieVersion = 0;
    const settings = JSON.parse(localStorage.getItem('rsc-game-settings')) || {
      cookieVersion,
    };
    const savedVersion = settings.cookieVersion;
    if (savedVersion !== cookieVersion) localStorage.clear();
    this.init();
  }

  init() {
    console.log('Main class loaded');
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
      physics: {
        default: 'matter',
        matter: {
          enableSleeping: true,
          gravity: {
            y: 1,
          },
          debug: {
            showBody: true,
            showStaticBody: true,
          },
        },
      },
      scene: SCENE_LIST,
    };
    this.game = new Phaser.Game(this.gameConfig);
  }
}

WebFont.load({
  google: {
    families: ['Montserrat'],
  },
});

const main = new Main();
window.main = main;
