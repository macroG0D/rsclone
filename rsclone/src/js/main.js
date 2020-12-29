import Phaser from 'phaser';
import MyGame from './game';
import Create from './component';

class Main {
  constructor() {
    const cookieVersion = 0;
    const settings = JSON.parse(localStorage.getItem('rsc-game-settings')) || { cookieVersion };
    const savedVersion = settings.cookieVersion;
    if (savedVersion !== cookieVersion) localStorage.clear();
    this.init();
  }

  async init() {
    console.log('Main class loaded');
    this.gameContainer = new Create('div', document.body, 'game-container').node;
    this.gameConfig = {
      type: Phaser.AUTO,
      parent: this.gameContainer,
      width: 1024,
      height: 768,
      scene: MyGame,
    };
    this.game = new Phaser.Game(this.gameConfig);
  }
}

const main = new Main();
window.main = main;
