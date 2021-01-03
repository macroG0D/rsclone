import Phaser from 'phaser';
// import MyGame from './game';
import Create from './component';
import StartScene from './startScene';
import BootScene from './bootScene';
import PreloadScene from './preloadScene';
import Level1Scene from './level1Scene';

class Main {
  constructor() {
    const cookieVersion = 0;
    const settings = JSON.parse(localStorage.getItem('rsc-game-settings')) || {
      cookieVersion
    };
    const savedVersion = settings.cookieVersion;
    if (savedVersion !== cookieVersion) localStorage.clear();
    this.init();
  }

  async init() {
    console.log('Main class loaded');
    this.gameContainer = new Create('div', document.body, 'game-container').node;
    const ratio = Math.max(window.innerWidth / window.innerHeight, window.innerHeight / window.innerWidth);
    const DEFAULT_HEIGHT = 1700;
    const DEFAULT_WIDTH = ratio * DEFAULT_HEIGHT;
    this.gameConfig = {
      type: Phaser.AUTO,
      parent: this.gameContainer,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: DEFAULT_WIDTH,
        height: DEFAULT_HEIGHT,
      },
      physics: {
        default: 'arcade',
        arcade: {
          gravity: {
            y: 1000,
          },
          debug: false,
        },
      },
      scene: [BootScene, PreloadScene, StartScene, Level1Scene],
    };
    this.game = new Phaser.Game(this.gameConfig);
  }
}

const main = new Main();
window.main = main;
