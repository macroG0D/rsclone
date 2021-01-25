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
    const homeDiv = document.getElementById('homeDiv');
    const aboutDiv = document.getElementById('aboutDiv');
    const gameDiv = document.getElementById('gameDiv');
    const gameFooter = document.getElementById('gameFooter');
    const gameHeader = document.getElementById('gameHeader');
    const btnBurger = document.getElementById('gameBtnBurger');
    const menuHome = document.getElementById('menuHome');
    const menuAbout = document.getElementById('menuAbout');
    const menuGame = document.getElementById('menuGame');
    this.pages = {
      home: homeDiv,
      about: aboutDiv,
      game: gameDiv,
      header: gameHeader,
      footer: gameFooter,
      btnBurger:btnBurger,
      menuHome:menuHome,
      menuAbout:menuAbout,
      menuGame:menuGame,
    };

    this.gameContainer = new Create('div', gameDiv, 'game-container').node;
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

    const page = this.getCurrPage();
    this.changeAddress(page);
    this.navigate();
    this.clickBurger();
  }

  clickBurger(){
    this.pages.btnBurger.addEventListener('click',()=>{
      this.pages.btnBurger.classList.toggle('header__burger--close');
      this.pages.btnBurger.classList.toggle('header__burger--open');
      this.pages.header.classList.toggle('header__hidden');
      this.pages.header.classList.toggle('header__display');
    });
  }

  saveSettings() {
    localStorage.setItem('rsc-game-settings', JSON.stringify(this.settings));
  }

  changeAddress(link) {
    const href = window.location.href.replace(/#(.*)/ig, '');
    window.location = `${href}#${link}`;
    // this.highlightMenu(link);
  }

  getCurrPage() {
    const { hash } = window.location;
    if (!hash || hash === '#') return 'home';
    let page = hash.replace('#', '');
    const { pages } = this;
    if (!(Object.keys(pages).includes(page))) page = 'home';
    return page;
  }

  navigate() {
    const nextLink = this.getCurrPage();
    const prevLink = this.prevLink || 'home';
    // this.unHighlightMenu(prevLink);
    const prevSection = this.pages[prevLink];
    const nextSection = this.pages[nextLink];
    prevSection.classList.add('hidden');
    nextSection.classList.remove('hidden');
    
    if(prevLink === "game"){
      this.pages.footer.classList.remove('footer--game');
      this.pages.menuGame.classList.remove('menu__item--active');
    }

    if(prevLink === "home"){
      this.pages.menuHome.classList.remove('menu__item--active');
    }

    if(prevLink === "about"){
      this.pages.header.classList.remove('header--about');
      this.pages.menuAbout.classList.remove('menu__item--active');
    }

    if(nextLink === "game"){
      this.pages.footer.classList.add('footer--game');    
      this.pages.menuGame.classList.add('menu__item--active');      
    }

    if(nextLink === "home"){      
      this.pages.menuHome.classList.add('menu__item--active');
    }

    if(nextLink === "about"){      
      this.pages.header.classList.add('header--about');
      this.pages.menuAbout.classList.add('menu__item--active');      
    }

    this.prevLink = nextLink;
  }
}

WebFont.load({
  google: { families: ['Montserrat'] },
});

const main = new Main();
window.main = main;
window.addEventListener('popstate', main.navigate.bind(main), false);
