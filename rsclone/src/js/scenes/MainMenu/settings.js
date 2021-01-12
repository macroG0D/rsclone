import Phaser from 'phaser';

import {
  createMenu,
} from '../../utils/createMenu';
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
  fill: '#D22D61',
};

const MENU_ITEM_HEIGHT = 60;

export default class MainMenuSettings extends Phaser.Scene {
  constructor() {
    super('MainMenuSettings');
  }

  create() {
    createBg(this);
    this.createItems();
    window.location.hash = this.scene.key;
  }

  createItems() {
    this.input.keyboard.createCursorKeys();
    const menuX = this.cameras.main.centerX;
    const menuY = this.cameras.main.centerY - MENU_ITEM_HEIGHT;
    const fullscreenItem = this.add.text(menuX, menuY + (-1 * MENU_ITEM_HEIGHT), 'fullscreen', menuItemStyle)
      .setOrigin(0.5)
      .setInteractive({
        useHandCursor: true,
      })
      .on('pointerover', () => fullscreenItem.setStyle(menuItemOverStyle))
      .on('pointerout', () => fullscreenItem.setStyle(menuItemStyle))
      .on('pointerdown', () => console.log('fullscreenItem'));

    const musicItem = this.add.text(menuX, menuY + (0 * MENU_ITEM_HEIGHT), 'music', menuItemStyle)
      .setOrigin(0.5)
      .setInteractive({
        useHandCursor: true,
      })
      .on('pointerover', () => musicItem.setStyle(menuItemOverStyle))
      .on('pointerout', () => musicItem.setStyle(menuItemStyle))
      .on('pointerdown', () => console.log('musicItem'));

    const soundItem = this.add.text(menuX, menuY + (1 * MENU_ITEM_HEIGHT), 'sound', menuItemStyle)
      .setOrigin(0.5)
      .setInteractive({
        useHandCursor: true,
      })
      .on('pointerover', () => soundItem.setStyle(menuItemOverStyle))
      .on('pointerout', () => soundItem.setStyle(menuItemStyle))
      .on('pointerdown', () => console.log('soundItem'));

    const engItem = this.add.text(menuX - 250, menuY + (2 * MENU_ITEM_HEIGHT), 'english', menuItemStyle)
      .setOrigin(0.5)
      .setInteractive({
        useHandCursor: true,
      })
      .on('pointerover', () => engItem.setStyle(menuItemOverStyle))
      .on('pointerout', () => engItem.setStyle(menuItemStyle))
      .on('pointerdown', () => console.log('engItem'));

    const langItem = this.add.text(menuX, menuY + (2 * MENU_ITEM_HEIGHT), 'language', menuItemDisableStyle)
      .setOrigin(0.5);

    const rusItem = this.add.text(menuX + 250, menuY + (2 * MENU_ITEM_HEIGHT), 'russian', menuItemStyle)
      .setOrigin(0.5)
      .setInteractive({
        useHandCursor: true,
      })
      .on('pointerover', () => rusItem.setStyle(menuItemOverStyle))
      .on('pointerout', () => rusItem.setStyle(menuItemStyle))
      .on('pointerdown', () => console.log('rusItem'));

    const applyItem = this.add.text(menuX, menuY + 250, 'apply', menuItemBackStyle)
      .setOrigin(0.5)
      .setInteractive({
        useHandCursor: true,
      })
      .on('pointerover', () => applyItem.setStyle(menuItemOverStyle))
      .on('pointerout', () => applyItem.setStyle(menuItemBackStyle))
      .on('pointerdown', () => console.log('apply'));
  }
}
