import Phaser from 'phaser';
import PhaserMatterCollisionPlugin from 'phaser-matter-collision-plugin';
import Create from './components/dom-create';

import Game from './components/game';

import { SCENES } from './scenes/_scenesList';

import { GAME_WIDTH, GAME_HEIGHT } from './constants';

import LOCALE_HTML from './localehtml';

const WebFont = require('webfontloader');

class Main {
  constructor() {
    const cookieVersion = 0;
    const settings = JSON.parse(localStorage.getItem('rsc-game-settings')) || {
      // locale: 'en',
      locale: 'ru',
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
    const bodyGame = document.querySelector('body');
    this.btnLang = document.querySelectorAll('.lang__item');
    this.textItems = document.querySelectorAll('[data-loc]');
    this.pages = {
      home: homeDiv,
      about: aboutDiv,
      game: gameDiv,
    };

    this.elements = {
      header: gameHeader,
      footer: gameFooter,
      btnBurger,
      menuHome,
      menuAbout,
      menuGame,
      bodyGame,
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
            showBody: true,
            showStaticBody: true,
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
      scene: SCENES,
      dom: { createContainer: true },
    };

    this.game = new Game(this, this.gameConfig);

    const page = this.getCurrPage();
    this.changeAddress(page);
    this.navigate();
    this.clickBurger();
    this.clickLang();
  }

  clickBurger() {
    this.elements.btnBurger.addEventListener('click', () => {
      this.toggleBurger()
    });
  }

  toggleBurger(){
    this.elements.btnBurger.classList.toggle('header__burger--close');
    this.elements.btnBurger.classList.toggle('header__burger--open');
    this.elements.header.classList.toggle('header__hidden');
    this.elements.header.classList.toggle('header__display');
    this.elements.bodyGame.classList.toggle('body__noscroll');
  }

  saveSettings() {
    localStorage.setItem('rsc-game-settings', JSON.stringify(this.settings));
  }

 clickLang(){
   this.btnLang.forEach((el) => el.addEventListener('click',(e)=>{
     this.settings.locale = e.target.dataset.lang;
     this.changeLang()
     this.btnLang.forEach((item)=>item.classList.toggle('lang__item--active'))
   }))
 }

  changeLang(){
   const curLang = LOCALE_HTML[this.settings.locale]
   this.textItems.forEach(el => el.innerHTML = curLang[el.dataset.loc]);
  }

  changeAddress(link) {
    const href = window.location.href.replace(/#(.*)/ig, '');
    window.location = `${href}#${link}`;
    this.highlightPage(link);
  }

  getCurrPage() {
    const { hash } = window.location;
    if (!hash || hash === '#') return 'home';
    let page = hash.replace('#', '');
    const { pages } = this;
    if (!(Object.keys(pages).includes(page))) page = 'home';
    return page;
  }

  highlightPage(link) {
    const element = `menu${link[0].toUpperCase()}${link.slice(1)}`;
    this.elements[element].classList.add('menu__item--active');
    this.elements.footer.classList.add(`footer--${link}`);
    this.elements.header.classList.add(`header--${link}`);
  }

  unHighlightPage(link) {
    const element = `menu${link[0].toUpperCase()}${link.slice(1)}`;
    this.elements[element].classList.remove('menu__item--active');
    this.elements.footer.classList.remove(`footer--${link}`);
    this.elements.header.classList.remove(`header--${link}`);
  }

  navigate() {
    const nextLink = this.getCurrPage();
    const prevLink = this.prevLink || 'home';
    this.unHighlightPage(prevLink);
    const prevSection = this.pages[prevLink];
    const nextSection = this.pages[nextLink];
    prevSection.classList.add('hidden');
    nextSection.classList.remove('hidden');
    this.prevLink = nextLink;
    this.highlightPage(nextLink);

    if(this.elements.header.classList.contains('header__display')){
      this.toggleBurger()
    }
  }
}

WebFont.load({
  google: { families: ['Montserrat'] },
});

const main = new Main();
window.main = main;
window.addEventListener('popstate', main.navigate.bind(main), false);
