import Phaser from 'phaser';
import Create from './components/dom-create';
import BootScene from './scenes/bootScene';
import PreloadScene from './scenes/preloadScene';
import StartScene from './scenes/startScene';
import Level1Scene from './scenes/level1Scene';

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
        width: 1280,
        height: 720,
      },
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 300 },
          debug: true,
        },
      },
      scene: [
        BootScene,
        PreloadScene,
        StartScene,
        Level1Scene,
      ],
    };
    this.game = new Phaser.Game(this.gameConfig);
  }
}

const main = new Main();
window.main = main;
