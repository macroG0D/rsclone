import Phaser from 'phaser';

import Menu from '../../components/menu';
import Range from '../../components/range';

import { playSound } from '../../utils/playSound';

import { localization } from '../../engine/localization';

export default class MainMenuPlay extends Phaser.Scene {
  constructor() {
    super('MainMenuSettings');
  }

  create() {
    const menuItems = {
      music: '',
      sound: '',
      language: '',
    };
    const menuCallBack = () => this.back();
    this.menu = new Menu(this, menuItems, true, menuCallBack);
    this.menu.menu.node.style.gridArea = '1 / 1 / 2 / 2';
    this.menu.menu.node.style.alignItems = 'flex-end';

    const rangeItems = {
      music: [200, 100, this.getSettings('music'), '', this.getSettings('music')],
      sound: [200, 100, this.getSettings('sound'), '', this.getSettings('sound')],
      locale: [undefined, 1, this.getSettings('locale'), 'en', 'ru'],
    };
    this.range = new Range(this, rangeItems, this.menu.container.node);
  }

  update() {
    localization(this);
  }

  back() {
    if (this.game.isStarted) {
      this.scene.wake('GameMenu');
      this.scene.stop();
      return;
    }
    this.scene.start('GameMenu');
  }

  focusOut(name) {
    const { left, right } = this.range.items[name];
    if (!left.node.innerHTML) {
      right.node.classList.remove('active');
    }
  }

  changeSettings(name) {
    const { settings } = this.game.app;
    const item = this.range.items[name];
    const { left, right } = item;
    const value = +item.range.node.value;
    playSound(this, 'machine_switch');
    switch (name) {
      case ('music'): {
        const newValue = parseFloat((value / 100).toFixed(2));
        settings.volume.music = newValue;
        if (this.game.music.current) this.game.music.current.setVolume(newValue);
        right.node.innerHTML = value;
        if (!left.node.innerHTML) right.node.classList.add('active');
        this.game.app.saveSettings();
        break;
      }

      case ('sound'): {
        const newValue = parseFloat((value / 100).toFixed(2));
        settings.volume.sound = newValue;
        right.node.innerHTML = value;
        if (!left.node.innerHTML) right.node.classList.add('active');
        this.game.app.saveSettings();
        break;
      }

      case ('locale'): {
        settings.locale = (value) ? 'ru' : 'en';
        if (value) {
          right.node.classList.add('active');
          left.node.classList.remove('active');
        }
        if (!value) {
          right.node.classList.remove('active');
          left.node.classList.add('active');
        }
        this.game.app.saveSettings();
        break;
      }

      default:
    }
  }

  getSettings(name) {
    const { settings } = this.game.app;
    switch (name) {
      case ('music'):
        return Math.floor(+settings.volume.music * 100);
      case ('sound'):
        return Math.floor(+settings.volume.sound * 100);
      case ('locale'):
        return +(settings.locale !== 'en');
      default:
        return 0;
    }
  }
}
