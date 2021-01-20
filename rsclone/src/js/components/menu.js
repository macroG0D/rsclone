import Create from './dom-create';

import { LOCALE } from '../locale';

export default class Menu extends Create {
  constructor(scene, menuItems, back = false, backCallback = () => scene.scene.switch('MainMenu')) {
    super('div', false, 'game-menu');
    this.scene = scene;
    scene.input.keyboard.createCursorKeys();
    const { centerX, centerY } = scene.cameras.main;
    const locale = LOCALE[scene.game.app.settings.locale];
    this.items = {};

    Object.entries(menuItems).forEach(([itemName, itemLink], itemIndex) => {
      const localItemName = locale[itemName] || itemName;
      const item = new Create('div', this.node, 'game-menu-item', localItemName);
      if (!itemIndex) {
        item.node.classList.add('game-menu-item-active');
        this.activeItem = itemIndex;
      }
      item.link = itemLink;
      item.index = itemIndex;
      item.node.addEventListener('click', itemLink, false);
      this.items[itemIndex] = item;
    });
    scene.input.keyboard.addKey('UP').on('down', () => this.switchItem('up'));
    scene.input.keyboard.addKey('DOWN').on('down', () => this.switchItem('down'));
    scene.input.keyboard.addKey('ENTER').on('down', () => this.selectItem());

    if (back) {
      const localBackName = locale.back;
      this.back = new Create('div', this.node, 'game-menu-item', localBackName);
      this.back.node.classList.add('game-menu-item-back');
      this.back.node.addEventListener('click', backCallback, false);
      scene.input.keyboard.addKey('ESC').on('down', backCallback);
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
    const total = Object.keys(this.items).length - 1;
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
