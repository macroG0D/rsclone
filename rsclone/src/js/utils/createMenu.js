import Create from '../components/dom-create';

export function createMenu(scene, menuItems, back = false, backCallback = () => scene.scene.switch('MainMenu')) {
  const menuX = scene.cameras.main.centerX;
  const menuY = scene.cameras.main.centerY;
  // scene.input.keyboard.createCursorKeys();
  const menu = new Create('div', false, 'game-menu');
  menu.items = {};
  Object.entries(menuItems).forEach(([itemName, itemLink], itemIndex) => {
    const item = new Create('div', menu.node, 'game-menu-item', itemName);
    if (!itemIndex) item.node.classList.add('game-menu-item-active');
    item.link = itemLink;
    item.index = itemIndex;
    item.node.addEventListener('click', itemLink, false);
    menu.items[itemName] = item;
  });

  if (back) {
    menu.back = new Create('div', menu.node, 'game-menu-item', 'back');
    menu.back.node.classList.add('game-menu-item-back');
    menu.back.node.addEventListener('click', backCallback, false);
  }

  menu.spawn = scene.add.dom(menuX, menuY, menu.node);
  menu.spawn.setOrigin(0.5);
  return menu;
}

export default createMenu;
