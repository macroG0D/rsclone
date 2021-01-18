import Phaser from 'phaser';

import { createBg } from '../../utils/createBg';

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
    window.location.hash = this.scene.key;
    this.isMusicOn = true;
    this.isSoundOn = true;
    this.isEnglishOn = true;
    this.isRusionOn = !this.isEnglishOn;
    this.createItems();
  }

  createItems() {
    // const isSelected = (menuItem, isON) => {
    //   (isON) ? menuItem.setStyle(menuItemSelectedStyle) : menuItem.setStyle(menuItemStyle);
    // };

    const isSelected2 = (isON) => {
      if (isON) {
        return menuItemSelectedStyle;
      }
      return menuItemStyle;
    };

    this.input.keyboard.createCursorKeys();
    const menuX = this.cameras.main.centerX;
    const menuY = this.cameras.main.centerY - MENU_ITEM_HEIGHT;
    const fullscreenItem = this.add.text(menuX, menuY + (-1 * MENU_ITEM_HEIGHT), 'fullscreen', isSelected2(this.game.scale.isFullscreen))
      .setOrigin(0.5)
      .setInteractive({
        useHandCursor: true,
      })
      .on('pointerover', () => fullscreenItem.setStyle(menuItemOverStyle))
      .on('pointerout', () => {
        fullscreenItem.setStyle(isSelected2(this.game.scale.isFullscreen));
      })
      .on('pointerdown', () => {
        if (!this.game.scale.isFullscreen) {
          this.game.scale.startFullscreen();
        } else {
          this.game.scale.stopFullscreen();
        }
      });

    const musicItem = this.add.text(menuX, menuY + (0 * MENU_ITEM_HEIGHT), 'music', isSelected2(this.isMusicOn))
      .setOrigin(0.5)
      .setInteractive({
        useHandCursor: true,
      })
      .on('pointerover', () => musicItem.setStyle(menuItemOverStyle))
      .on('pointerout', () => {
        musicItem.setStyle(isSelected2(this.isMusicOn));
      })
      .on('pointerdown', () => {
        this.isMusicOn = !this.isMusicOn;
      });

    const soundItem = this.add.text(menuX, menuY + (1 * MENU_ITEM_HEIGHT), 'sound', isSelected2(this.isSoundOn))
      .setOrigin(0.5)
      .setInteractive({
        useHandCursor: true,
      })
      .on('pointerover', () => soundItem.setStyle(menuItemOverStyle))
      .on('pointerout', () => {
        soundItem.setStyle(isSelected2(this.isSoundOn));
      })
      .on('pointerdown', () => {
        this.isSoundOn = !this.isSoundOn;
      });

    const engItem = this.add.text(menuX - 150, menuY + (2 * MENU_ITEM_HEIGHT), 'english', isSelected2(this.isEnglishOn))
      .setOrigin(0.5)
      .setInteractive({
        useHandCursor: true,
      })
      .on('pointerover', () => engItem.setStyle(menuItemOverStyle))
      .on('pointerout', () => {
        engItem.setStyle(isSelected2(this.isEnglishOn));
      });
    // .on('pointerdown', () => {
    //   this.isEnglishOn = !this.isEnglishOn;
    //   this.isRussianOn = !this.isRussianOn;
    //   engItem.setStyle(isSelected2(this.isEnglishOn));
    //   rusItem.setStyle(isSelected2(this.isRussianOn));
    // });

    this.add.text(menuX, menuY + (2 * MENU_ITEM_HEIGHT), 'language', menuItemDisableStyle)
      .setOrigin(0.5);

    const rusItem = this.add.text(menuX + 150, menuY + (2 * MENU_ITEM_HEIGHT), 'russian', isSelected2(this.isRussianOn))
      .setOrigin(0.5)
      .setInteractive({
        useHandCursor: true,
      })
      .on('pointerover', () => rusItem.setStyle(menuItemOverStyle))
      .on('pointerout', () => {
        rusItem.setStyle(isSelected2(this.isRussianOn));
      })
      .on('pointerdown', () => {
        this.isEnglishOn = !this.isEnglishOn;
        this.isRussianOn = !this.isRussianOn;
      });

    engItem.on('pointerdown', () => {
      this.isEnglishOn = !this.isEnglishOn;
      this.isRussianOn = !this.isRussianOn;
    });

    const applyItem = this.add.text(menuX, menuY + 250, 'apply', menuItemBackStyle)
      .setOrigin(0.5)
      .setInteractive({
        useHandCursor: true,
      })
      .on('pointerover', () => applyItem.setStyle(menuItemOverStyle))
      .on('pointerout', () => applyItem.setStyle(menuItemBackStyle))
      .on('pointerdown', () => this.scene.switch('MainMenu'));

    this.game.scale.on('leavefullscreen', () => {
      fullscreenItem.setStyle(isSelected2(this.game.scale.isFullscreen));
    });
  }
}
