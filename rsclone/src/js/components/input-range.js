import Create from './dom-create';

export default class InputRange extends Create {
  constructor(parent, width = 50, max = 1, value = 0, left = '', right = '') {
    super('div', parent, 'game-input');
    this.container = new Create('div', this.node, 'game-input-container');
    this.left = new Create('div', this.container.node, 'game-input-label', left);
    this.range = new Create('input', this.container.node, 'game-input-range');
    this.right = new Create('div', this.container.node, 'game-input-label', right);

    if (left) {
      this.left.name = left;
      if (!value && max) this.left.node.classList.add('active');
    }

    if (right) {
      this.right.name = right;
      if (left && value === max) this.right.node.classList.add('active');
    }

    this.range.node.type = 'range';
    this.range.node.min = 0;
    this.range.node.max = max;
    this.range.node.value = value;
    this.range.node.style.width = `${width}px`;
  }
}
