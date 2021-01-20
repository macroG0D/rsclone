import Create from './dom-create';

import { LOCALE } from '../locale';

export default class Menu extends Create {
  constructor(scene, menuItems, back = false, backCallback = () => scene.scene.switch('MainMenu')) {
    super('div', false, 'game-menu');
    const { centerX, centerY } = scene.cameras.main;
    const locale = LOCALE[scene.game.app.settings.locale];
    scene.input.keyboard.createCursorKeys();
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
      this.items[itemName] = item;
    });

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
}
