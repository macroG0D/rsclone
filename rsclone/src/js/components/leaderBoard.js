import Create from './dom-create';

import { playSound } from '../utils/playSound';

import { LOCALE } from '../locale';

export default class LeaderBoard extends Create {
  constructor(scene, id) {
    super('div', false, 'leader-board');
    this.scene = scene;
    this.id = id;
    const locale = LOCALE[scene.game.app.settings.locale];
    const nameText = locale.name || 'name';
    const scoreText = locale.score || 'score';
    const timeText = locale.time || 'time';
    const backText = locale.back || 'back';
    this.container = new Create('div', this.node, 'board-container');
    this.caption = new Create('div', this.container.node, 'board-caption');
    this.caption.position = new Create('span', this.caption.node, 'board-caption-position', '#');
    this.caption.name = new Create('span', this.caption.node, '', nameText);
    this.caption.name.name = 'name';
    this.caption.score = new Create('span', this.caption.node, '', scoreText);
    this.caption.score.name = 'score';
    this.caption.time = new Create('span', this.caption.node, 'board-caption-time', timeText);
    this.caption.time.name = 'score';

    const loadingText = '<span></span><span></span><span>loading data...</span>';
    this.table = new Create('div', this.container.node, 'board-table', loadingText);

    this.back = new Create('div', this.container.node, 'game-menu-item', backText);
    this.back.node.classList.add('game-menu-back');
    this.back.node.classList.add('game-menu-item-back');
    this.back.node.classList.add('game-menu-item-active');
    this.back.node.addEventListener('click', () => { this.clickBack(); }, false);
    scene.input.keyboard.removeAllKeys(true);
    scene.input.keyboard.addKey('ESC').on('down', () => { this.clickBack(); });
    scene.input.keyboard.addKey('ENTER').on('down', () => { this.clickBack(); });

    const { centerX, centerY } = scene.cameras.main;
    this.spawn = scene.add.dom(centerX, centerY, this.node);
    this.spawn.setOrigin(0.5);
  }

  clickBack() {
    playSound(this.scene, 'switchclick');
    this.scene.scene.start('MainMenu');
  }

  updateTable(data) {
    this.table.node.innerHTML = '';
    this.table.lines = [];
    data.forEach((item, index) => {
      const {
        score,
        time,
        name,
        _id,
      } = item;
      const position = index + 1;
      const formattedTime = new Date(time).toISOString().substr(14, 5);
      const itemPosition = new Create('span', this.table.node, 'board-table-item', position);
      itemPosition.node.classList.add('board-table-position');
      const itemName = new Create('span', this.table.node, 'board-table-item', name);
      const itemScore = new Create('span', this.table.node, 'board-table-item', score);
      const itemTime = new Create('span', this.table.node, 'board-table-item', formattedTime);
      itemTime.node.classList.add('board-table-time');
      if (this.id && this.id === _id) {
        itemPosition.node.classList.add('active');
        itemName.node.classList.add('active');
        itemScore.node.classList.add('active');
        itemTime.node.classList.add('active');
      }
      const line = {
        position: itemPosition,
        name: itemName,
        score: itemScore,
        time: itemTime,
      };
      this.table.lines.push(line);
    });
  }
}
