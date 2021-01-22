import Create from './dom-create';

import { LOCALE } from '../locale';

export default class Menu extends Create {
  constructor(scene, menuItems, back = false, backCallback) {
    super('div', false, 'game-menu');
    this.scene = scene;
    scene.input.keyboard.createCursorKeys();
    const { centerX, centerY } = scene.cameras.main;
    const locale = LOCALE[scene.game.app.settings.locale];
    this.items = [];

    Object.entries(menuItems).forEach(([itemName, itemLink], itemIndex) => {
      const localItemName = locale[itemName] || itemName;
      const item = new Create('div', this.node, 'game-menu-item', localItemName);
      if (!itemIndex) {
        item.node.classList.add('game-menu-item-active');
        this.activeItem = itemIndex;
      }
      item.name = itemName;
      item.link = itemLink;
      item.index = itemIndex;
      this.items.push(item);
      item.node.addEventListener('pointerdown', itemLink, false);
      item.node.addEventListener('pointermove', () => this.highlightItem(itemIndex), false);
    });
    scene.input.keyboard.addKey('UP').on('down', () => this.switchItem('up'));
    scene.input.keyboard.addKey('DOWN').on('down', () => this.switchItem('down'));
    scene.input.keyboard.addKey('ENTER').on('down', () => this.selectItem());

    if (back) {
      const bcc = backCallback || function bcc() { scene.scene.switch('MainMenu'); };
      const index = this.items.length;
      const localBackName = locale.back;
      this.back = new Create('div', this.node, 'game-menu-item', localBackName);
      this.back.name = 'back';
      this.back.link = bcc;
      this.back.index = index;
      this.items.push(this.back);
      this.back.node.classList.add('game-menu-item-back');
      this.back.node.addEventListener('pointerdown', bcc, false);
      this.back.node.addEventListener('pointermove', () => this.highlightItem(index), false);
      scene.input.keyboard.addKey('ESC').on('down', bcc);
    }

    this.spawn = scene.add.dom(centerX, centerY, this.node);
    this.spawn.setOrigin(0.5);
  }

  highlightItem(next) {
    const current = this.activeItem;
    if (next !== current) {
      this.items[current].node.classList.remove('game-menu-item-active');
      this.items[next].node.classList.add('game-menu-item-active');
      this.activeItem = next;
    }
  }

  switchItem(direction) {
    const total = this.items.length - 1;
    const current = this.activeItem;
    const change = (direction === 'up') ? -1 : 1;
    let next = current + change;
    if (next < 0 || next > total) next = current;
    if (next !== current) this.highlightItem(next);
  }

  selectItem(item = this.activeItem) {
    const { link } = this.items[item];
    link.call(this.scene);
  }
}
