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

const menuItemOverStyle = {
  fill: '#D22D61',
};

const MENU_ITEM_HEIGHT = 60;

export function createMenu(scene, menuItems, back = false, backCallback = () => scene.scene.start('MainMenu')) {
  const menuX = scene.cameras.main.centerX;
  const menuY = scene.cameras.main.centerY - MENU_ITEM_HEIGHT;

  Object.entries(menuItems).forEach(([itemName, itemLink], itemIndex) => {
    const menuItem = scene.add.text(
      menuX,
      menuY + (itemIndex * MENU_ITEM_HEIGHT),
      itemName,
      menuItemStyle,
    )
      .setOrigin(0.5)
      .setInteractive()
      .on('pointerover', () => menuItem.setStyle(menuItemOverStyle))
      .on('pointerout', () => menuItem.setStyle(menuItemStyle))
      .on('pointerdown', () => itemLink());
  });

  if (back) {
    const menuItemBack = scene.add.text(menuX, menuY + 250, 'back', menuItemBackStyle)
      .setOrigin(0.5)
      .setInteractive()
      .on('pointerover', () => menuItemBack.setStyle(menuItemOverStyle))
      .on('pointerout', () => menuItemBack.setStyle(menuItemBackStyle))
      .on('pointerdown', backCallback);
  }
}

export default createMenu;