import Create from './dom-create';

import { playSound } from '../utils/playSound';

import { LOCALE } from '../locale';

export default class Menu extends Create {
  constructor(scene, menuItems, back = false, backCallback) {
    super('div', false, 'game-menu');
    const locale = LOCALE[scene.game.app.settings.locale];
    this.scene = scene;
    this.container = new Create('div', this.node, 'game-menu-container');
    this.menu = new Create('div', this.container.node, 'game-menu-menu');
    this.items = [];

    Object.entries(menuItems).forEach(([itemName, itemLink], itemIndex) => {
      const localItemName = locale[itemName] || itemName;
      const item = new Create('div', this.menu.node, 'game-menu-item', localItemName);
      if (!itemIndex) {
        item.node.classList.add('game-menu-item-active');
        this.activeItem = itemIndex;
      }
      item.name = itemName;
      item.index = itemIndex;
      this.items.push(item);
      if (itemLink) {
        item.link = itemLink;
        item.node.addEventListener('click', () => this.selectItem(itemIndex), false);
      }
      item.node.addEventListener('pointermove', () => this.highlightItem(itemIndex), false);
    });
    scene.input.keyboard.removeAllKeys();
    scene.input.keyboard.addKey('UP').on('down', () => this.switchItem('up'));
    scene.input.keyboard.addKey('DOWN').on('down', () => this.switchItem('down'));
    scene.input.keyboard.addKey('ENTER').on('down', () => this.selectItem());

    if (back) {
      const bcc = backCallback || function bcc() { scene.scene.start('MainMenu'); };
      this.bcc = bcc;
      const index = this.items.length;
      const localBackName = locale.back || 'back';
      this.back = new Create('div', this.node, 'game-menu-item', localBackName);
      this.back.node.classList.add('game-menu-back');
      this.back.name = 'back';
      this.back.link = bcc;
      this.back.index = index;
      this.items.push(this.back);
      this.back.node.classList.add('game-menu-item-back');
      this.back.node.addEventListener('click', () => this.selectItem(index), false);
      this.back.node.addEventListener('pointermove', () => this.highlightItem(index), false);
      scene.input.keyboard.addKey('ESC').on('down', () => this.menuBack());
    }

    const x = this.scene.game.config.width / 2;
    const y = this.scene.game.config.height / 2;
    this.spawn = scene.add.dom(x, y, this.node);
    this.spawn.setOrigin(0.5);
  }

  highlightItem(next) {
    const current = this.activeItem;
    if (next !== current) {
      this.items[current].node.classList.remove('game-menu-item-active');
      this.items[next].node.classList.add('game-menu-item-active');
      this.activeItem = next;
      playSound(this.scene, 'switch');
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

  selectItem(index) {
    const itemIndex = (index !== undefined) ? index : this.activeItem;
    const { link } = this.items[itemIndex];
    if (link) link();
    playSound(this.scene, 'switchclick');
  }

  menuBack() {
    if (this.bcc) this.bcc();
    playSound(this.scene, 'switchclick');
  }
}
