import Create from './dom-create';
import InputRange from './input-range';

import { LOCALE } from '../locale';

export default class Range extends Create {
  constructor(scene, rangeItems) {
    super('div', false, 'game-range');
    const locale = LOCALE[scene.game.app.settings.locale];
    this.scene = scene;
    // scene.input.keyboard.createCursorKeys();
    this.items = {};

    Object.entries(rangeItems).forEach(([itemName, itemConfig], itemIndex) => {
      const item = new InputRange(this.node, ...itemConfig);
      item.index = itemIndex;
      item.name = itemName;
      this.items[itemName] = item;
      item.range.node.addEventListener('input', () => scene.changeSettings(itemName), false);
      item.range.node.addEventListener('focusout', () => scene.focusOut(itemName), false);
      item.node.addEventListener('pointermove', () => scene.menu.highlightItem(itemIndex), false);
      /*
      const item = new Create('div', this.node, 'game-menu-item', localItemName);
      if (!itemIndex) {
        item.node.classList.add('game-menu-item-active');
        this.activeItem = itemIndex;
      }
      item.link = itemLink;
      item.index = itemIndex;
      this.items.push(item);
      item.node.addEventListener('pointerdown', itemLink, false);
      item.node.addEventListener('pointermove', () => this.highlightItem(itemIndex), false);
      */
    });
    /*
    scene.input.keyboard.addKey('UP').on('down', () => this.switchItem('up'));
    scene.input.keyboard.addKey('DOWN').on('down', () => this.switchItem('down'));
    scene.input.keyboard.addKey('ENTER').on('down', () => this.selectItem());

    if (back) {
      const index = this.items.length;
      const localBackName = locale.back;
      this.back = new Create('div', this.node, 'game-menu-item', localBackName);
      this.back.link = backCallback;
      this.back.index = index;
      this.items.push(this.back);
      this.back.node.classList.add('game-menu-item-back');
      this.back.node.addEventListener('pointerdown', backCallback, false);
      this.back.node.addEventListener('pointermove', () => this.highlightItem(index), false);
      scene.input.keyboard.addKey('ESC').on('down', backCallback);
    }
    */
    const { x, y } = scene.menu.spawn;
    this.scene.menu.spawn.x -= 200;
    this.scene.menu.back.node.style.marginLeft = '250px';
    this.spawn = scene.add.dom(x + 200, y - 38, this.node);
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
