import Create from '../components/dom-create';

import { LOCALE } from '../locale';

export function createMenu(scene, menuItems, back = false, backCallback = () => scene.scene.switch('MainMenu')) {
  const { centerX, centerY } = scene.cameras.main;
  const locale = LOCALE[scene.game.app.settings.locale];
  scene.input.keyboard.createCursorKeys();
  const menu = new Create('div', false, 'game-menu');
  menu.items = {};
  Object.entries(menuItems).forEach(([itemName, itemLink], itemIndex) => {
    const localItemName = locale[itemName] || itemName;
    const item = new Create('div', menu.node, 'game-menu-item', localItemName);
    if (!itemIndex) {
      item.node.classList.add('game-menu-item-active');
      menu.activeItem = itemIndex;
    }
    item.link = itemLink;
    item.index = itemIndex;
    item.node.addEventListener('click', itemLink, false);
    menu.items[itemName] = item;
  });

  if (back) {
    const localBackName = locale.back;
    menu.back = new Create('div', menu.node, 'game-menu-item', localBackName);
    menu.back.node.classList.add('game-menu-item-back');
    menu.back.node.addEventListener('click', backCallback, false);
    scene.input.keyboard.addKey('ESC').on('down', backCallback);
  }

  menu.spawn = scene.add.dom(centerX, centerY, menu.node);
  menu.spawn.setOrigin(0.5);
  return menu;
}

export default createMenu;
