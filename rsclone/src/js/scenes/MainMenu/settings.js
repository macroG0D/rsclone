import Phaser from 'phaser';

import {
  createBg,
} from '../../utils/createBg';

const menuItemStyle = {
  font: '30px Montserrat',
  fill: '#000000',
  align: 'center',
  fontStyle: 'strong',
};

const menuItemBackStyle = {
  font: '20px Montserrat',
  fill: '#979797',
  align: 'center',
  fontStyle: 'strong',
};

const menuItemDisableStyle = {
  font: '30px Montserrat',
  fill: '#cccccc',
  align: 'center',
  fontStyle: 'strong',
};

const menuItemOverStyle = {
  fill: '#D22D61',
};

const menuItemSelectedStyle = {
  font: '30px Montserrat',
  fill: '#D22D61',
  align: 'center',
  fontStyle: 'strong',
};

const MENU_ITEM_HEIGHT = 60;

export default class MainMenuSettings extends Phaser.Scene {
  constructor() {
    super('MainMenuSettings');
  }

  create() {
    createBg(this);
    this.isMusicOn = true;
    this.isSoundOn = true;
    this.createItems();
    this.updateItems();
  }

  createItems() {
    const isSelected = (isON) => {
      if (isON) {
        return menuItemSelectedStyle;
      }
      return menuItemStyle;
    };

    this.input.keyboard.createCursorKeys();
    const menuX = this.cameras.main.centerX;
    const menuY = this.cameras.main.centerY - MENU_ITEM_HEIGHT;
    this.fullscreenItem = this.add.text(menuX, menuY + (-1 * MENU_ITEM_HEIGHT), '', isSelected(this.game.scale.isFullscreen))
      .setOrigin(0.5)
      .setInteractive({
        useHandCursor: true,
      })
      .on('pointerover', () => this.fullscreenItem.setStyle(menuItemOverStyle))
      .on('pointerout', () => {
        this.fullscreenItem.setStyle(isSelected(this.game.scale.isFullscreen));
      })
      .on('pointerdown', () => {
        if (!this.game.scale.isFullscreen) {
          this.game.scale.startFullscreen();
        } else {
          this.game.scale.stopFullscreen();
        }
      });

    this.musicItem = this.add.text(menuX, menuY + (0 * MENU_ITEM_HEIGHT), '', isSelected(this.isMusicOn))
      .setOrigin(0.5)
      .setInteractive({
        useHandCursor: true,
      })
      .on('pointerover', () => this.musicItem.setStyle(menuItemOverStyle))
      .on('pointerout', () => {
        this.musicItem.setStyle(isSelected(this.isMusicOn));
      })
      .on('pointerdown', () => {
        this.isMusicOn = !this.isMusicOn;
      });

    this.soundItem = this.add.text(menuX, menuY + (1 * MENU_ITEM_HEIGHT), '', isSelected(this.isSoundOn))
      .setOrigin(0.5)
      .setInteractive({
        useHandCursor: true,
      })
      .on('pointerover', () => this.soundItem.setStyle(menuItemOverStyle))
      .on('pointerout', () => {
        this.soundItem.setStyle(isSelected(this.isSoundOn));
      })
      .on('pointerdown', () => {
        this.isSoundOn = !this.isSoundOn;
      });

    this.engItem = this.add.text(menuX - 100, menuY + (2 * MENU_ITEM_HEIGHT), '', isSelected(this.game.localeEng))
      .setOrigin(1, 0.5)
      .setInteractive({
        useHandCursor: true,
      })
      .on('pointerover', () => this.engItem.setStyle(menuItemOverStyle))
      .on('pointerout', () => {
        this.engItem.setStyle(isSelected(this.game.localeEng));
      });

    this.langItem = this.add.text(menuX, menuY + (2 * MENU_ITEM_HEIGHT), '', menuItemDisableStyle)
      .setOrigin(0.5);

    this.rusItem = this.add.text(menuX + 100, menuY + (2 * MENU_ITEM_HEIGHT), '', isSelected(!this.game.localeEng))
      .setOrigin(0, 0.5)
      .setInteractive({
        useHandCursor: true,
      })
      .on('pointerover', () => this.rusItem.setStyle(menuItemOverStyle))
      .on('pointerout', () => {
        this.rusItem.setStyle(isSelected(!this.game.localeEng));
      })
      .on('pointerdown', () => {
        this.game.localeEng = !this.game.localeEng;
        this.engItem.setStyle(isSelected(this.game.localeEng));
        this.updateItems();
      });

    this.engItem.on('pointerdown', () => {
      this.game.localeEng = !this.game.localeEng;
      this.rusItem.setStyle(isSelected(!this.game.localeEng));
      this.updateItems();
    });

    this.applyItem = this.add.text(menuX, 610, '', menuItemBackStyle)
      .setOrigin(0.5)
      .setInteractive({
        useHandCursor: true,
      })
      .on('pointerover', () => this.applyItem.setStyle(menuItemOverStyle))
      .on('pointerout', () => this.applyItem.setStyle(menuItemBackStyle))
      .on('pointerdown', () => this.scene.switch('MainMenu'));

    this.game.scale.on('leavefullscreen', () => {
      this.fullscreenItem.setStyle(isSelected(this.game.scale.isFullscreen));
    });
  }

  updateItems() {
    if (this.game.localeEng) {
      this.fullscreenItem.setText('fullscreen');
      this.musicItem.setText('music');
      this.soundItem.setText('sound');
      this.rusItem.setText('russian');
      this.engItem.setText('english');
      this.langItem.setText('language');
      this.applyItem.setText('apply');
    } else {
      this.fullscreenItem.setText(' на весь экран');
      this.musicItem.setText('музыка');
      this.soundItem.setText('звук');
      this.rusItem.setText('русский');
      this.engItem.setText('английский');
      this.langItem.setText('язык');
      this.applyItem.setText('применить');
    }
  }

  checkLang() {
    if (!this.game.localeEng) {
      this.updateLang();
    }
    this.events.on('wake', () => {
      if (this.eng !== this.game.localeEng) {
        this.updateLang();
        this.eng = this.game.localeEng;
      }
    });
  }
}
