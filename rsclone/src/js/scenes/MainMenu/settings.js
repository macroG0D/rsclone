import Phaser from 'phaser';

import Menu from '../../components/menu';
import Range from '../../components/range';

import { localization } from '../../utils/localization';

export default class MainMenuPlay extends Phaser.Scene {
  constructor() {
    super('MainMenuSettings');
  }

  create() {
    const menuItems = {
      fullscreen: () => {},
      music: () => {},
      sound: () => {},
      language: () => {},
    };
    const menuCallBack = () => this.back();
    this.menu = new Menu(this, menuItems, true, menuCallBack);

    const rangeItems = {
      fullscreen: [undefined, 1, this.getSettings('fullscreen'), 'off', 'on'],
      music: [200, 100, this.getSettings('music'), '', this.getSettings('music')],
      sound: [200, 100, this.getSettings('sound'), '', this.getSettings('sound')],
      locale: [undefined, 1, this.getSettings('locale'), 'english', 'russian'],
    };
    this.range = new Range(this, rangeItems);
  }

  update() {
    localization(this);
  }

  back() {
    this.scene.switch((this.game.isStarted) ? 'GameMenu' : 'MainMenu');
  }

  changeSettings(name) {
    const { settings } = this.game.app;
    const item = this.range.items[name];
    const { value } = item.range.node;
    switch (name) {
      case ('fullscreen'):
        settings.fullscreen = !!(+value);
        if (settings.fullscreen && !document.fullscreenElement) {
          this.game.app.gameContainer.requestFullscreen();
        }
        if (!settings.fullscreen && document.fullscreenElement && document.exitFullscreen) {
          document.exitFullscreen();
        }
        break;
      case ('music'):
        settings.music.volume = value / 100;
        if (this.game.music.current) this.game.music.current.setVolume(value / 100);
        break;
      case ('sound'):
        settings.sound.volume = value / 100;
        break;
      case ('locale'):
        settings.locale = (+value) ? 'ru' : 'en';
        break;
      default:
    }
  }

  getSettings(name) {
    const { settings } = this.game.app;
    switch (name) {
      case ('fullscreen'):
        return +settings.fullscreen;
      case ('music'):
        return +settings.music.volume * 100;
      case ('sound'):
        return +settings.sound.volume * 100;
      case ('locale'):
        return +(settings.locale !== 'en');
      default:
        return 0;
    }
  }
}
