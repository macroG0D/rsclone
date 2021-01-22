import Create from './dom-create';
import InputRange from './input-range';

export default class Range extends Create {
  constructor(scene, rangeItems, parent) {
    super('div', parent, 'game-menu-range');
    this.scene = scene;
    this.items = {};

    Object.entries(rangeItems).forEach(([itemName, itemConfig], itemIndex) => {
      const item = new InputRange(this.node, ...itemConfig);
      item.index = itemIndex;
      item.name = itemName;
      this.items[itemName] = item;
      item.range.node.addEventListener('input', () => scene.changeSettings(itemName), false);
      item.range.node.addEventListener('focusout', () => scene.focusOut(itemName), false);
      item.node.addEventListener('pointermove', () => scene.menu.highlightItem(itemIndex), false);
    });

    scene.input.keyboard.addKey('LEFT').on('down', () => this.switchItem('left'));
    scene.input.keyboard.addKey('RIGHT').on('down', () => this.switchItem('right'));
  }

  switchItem(direction) {
    const index = this.scene.menu.activeItem;
    Object.values(this.items).forEach((rangeItem) => {
      const item = rangeItem;
      if (item.index === index) {
        const total = +item.range.node.max;
        const current = +item.range.node.value;
        const change = (direction === 'left') ? -1 : 1;
        let next = current + change;
        if (next < 0 || next > total) next = current;
        if (next !== current) {
          item.range.node.focus();
          item.range.node.value = next;
          this.scene.changeSettings(item.name);
        }
      }
    });
  }
}
