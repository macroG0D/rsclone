import Create from '../components/dom-create';

import { LOCALE } from '../locale';

export function createMenu(scene, menuItems, back = false, backCallback = () => scene.scene.switch('MainMenu')) {
  const menuX = scene.cameras.main.centerX;
  const menuY = scene.cameras.main.centerY;
  const locale = LOCALE[scene.game.app.settings.locale];
  scene.input.keyboard.createCursorKeys();
  scene.input.keyboard.addKey('ESC').on('down', backCallback);
  const menu = new Create('div', false, 'game-menu');
  menu.items = {};
  Object.entries(menuItems).forEach(([itemName, itemLink], itemIndex) => {
    const localItemName = locale[itemName];
    const item = new Create('div', menu.node, 'game-menu-item', localItemName);
    if (!itemIndex) item.node.classList.add('game-menu-item-active');
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
  }

  menu.spawn = scene.add.dom(menuX, menuY, menu.node);
  menu.spawn.setOrigin(0.5);
  return menu;
}

export default createMenu;
