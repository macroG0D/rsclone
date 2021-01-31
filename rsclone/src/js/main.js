import Phaser from 'phaser';
import PhaserMatterCollisionPlugin from 'phaser-matter-collision-plugin';
import VirtualJoystickPlugin from 'phaser3-rex-plugins/plugins/virtualjoystick-plugin';
import Create from './components/dom-create';

import Game from './components/game';

import { SCENES } from './scenes/_scenesList';

import { GAME_WIDTH, GAME_HEIGHT } from './constants';

import { LOCALE_HTML } from './localehtml';

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
    this.btnLang = document.querySelectorAll('.lang__item');
    this.textItems = document.querySelectorAll('[data-loc]');

    this.pages = {
      home: document.getElementById('homeDiv'),
      about: document.getElementById('aboutDiv'),
      game: document.getElementById('gameDiv'),
    };

    this.elements = {
      header: document.getElementById('gameHeader'),
      footer: document.getElementById('gameFooter'),
      btnBurger: document.getElementById('gameBtnBurger'),
      menuHome: document.getElementById('menuHome'),
      menuAbout: document.getElementById('menuAbout'),
      menuGame: document.getElementById('menuGame'),
    };

    const page = this.getCurrPage();
    this.changeAddress(page);
    this.navigate();
    this.clickBurger();
    this.clickLang();
  }

  spawnGame() {
    const gameDiv = document.getElementById('gameDiv');
    this.gameContainer = new Create('div', gameDiv, 'game-container').node;
    this.gameConfig = {
      type: Phaser.AUTO,
      parent: this.gameContainer,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: GAME_WIDTH,
        height: GAME_HEIGHT,
        autoRound: true,
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
        global: [{
          key: 'rexVirtualJoystick',
          plugin: VirtualJoystickPlugin,
          start: true,
        }],
        scene: [{
          plugin: PhaserMatterCollisionPlugin,
          key: 'matterCollision',
          mapping: 'matterCollision',
        }],
      },
      fps: {
        target: 60,
        forceSetTimeOut: true,
      },
      scene: SCENES,
      dom: { createContainer: true, behindCanvas: true },
      input: {
        keyboard: { target: window },
        windowEvents: true,
      },
    };

    this.game = new Game(this, this.gameConfig);
  }

  clickBurger() {
    this.elements.btnBurger.addEventListener('click', () => {
      this.toggleBurger();
    });
  }

  toggleBurger() {
    this.elements.btnBurger.classList.toggle('header__burger--close');
    this.elements.btnBurger.classList.toggle('header__burger--open');
    this.elements.header.classList.toggle('header__hidden');
    this.elements.header.classList.toggle('header__display');
    document.body.classList.toggle('body__noscroll');
  }

  saveSettings() {
    localStorage.setItem('rsc-game-settings', JSON.stringify(this.settings));
  }

  clickLang() {
    this.btnLang.forEach((btn) => btn.addEventListener('click', (e) => {
      if (!btn.classList.contains('lang__item--active')) {
        this.settings.locale = e.target.dataset.lang;
        this.changeLang();
        this.btnLang.forEach((item) => item.classList.toggle('lang__item--active'));
      }
    }));
  }

  changeLang() {
    const curLang = LOCALE_HTML[this.settings.locale];
    this.textItems.forEach((el) => {
      const currEl = el;
      currEl.innerHTML = curLang[el.dataset.loc];
    });
  }

  changeAddress(link) {
    const href = window.location.href.replace(/#(.*)/ig, '');
    window.location = `${href}#${link}`;
    this.highlightPage(link);
  }

  getCurrPage() {
    const { hash } = window.location;
    if (!hash || hash === '#') return 'game';
    let page = hash.replace('#', '');
    const { pages } = this;
    if (!(Object.keys(pages).includes(page))) page = 'game';
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
    prevSection.classList.remove('active');
    nextSection.classList.remove('hidden');
    nextSection.classList.add('active');
    this.prevLink = nextLink;
    this.highlightPage(nextLink);

    if (this.elements.header.classList.contains('header__display')) this.toggleBurger();

    if (nextLink === 'game' && !this.game) this.spawnGame();
  }
}

WebFont.load({
  google: { families: ['Montserrat'] },
});

const main = new Main();
window.main = main;
window.addEventListener('popstate', main.navigate.bind(main), false);
