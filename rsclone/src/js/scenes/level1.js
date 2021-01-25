import Phaser from 'phaser';

import Player from '../sprites/player';
import Portal from '../sprites/portal';
import MovingPlatform from '../sprites/movingPlatform';
import LevelsEntourage from '../levels/levelsEntourage';

import Score from '../components/score';

import Input from '../utils/input';
import NetworkInput from '../utils/networkInput';
import NetworkSync from '../utils/networkSync';
import LevelEnd from '../utils/levelEnd';

import StandartHedgehog from '../sprites/enemies/standartHedgehog';
import JumpingHedgehog from '../sprites/enemies/jumpingHedgehog';
import { gradientSquares, gradientColors, walls } from '../levels/level1/backgroundStructure';

import {
  BORDER_THICKNESS,
  PLAYER_1_CONTROLS,
  PLAYER_2_CONTROLS,
  COLLISION_CATEGORIES,
} from '../constants';

import { playMusic } from '../utils/playMusic';

const levelWidth = 10500;
const levelHeight = 2890;

const parallaxImages = {
  sky: 0.2,
  clouds_0: 0.1,
  bg_0: 0.1,
  bg_1: 0.2,
  bg_2: 0.3,
};
export default class Level1 extends Phaser.Scene {
  constructor() {
    super('Level1');
    this.walls = [];
    this.portals = [];
  }

  create(gameData) {
    this.input.keyboard.removeAllKeys(true);
    this.client = this.game.client;
    if (gameData && gameData.online) {
      this.online = true;
      this.playerKey = (gameData.master) ? 'ibb' : 'obb';
      this.player1Input = new Input(this, this.playerKey, PLAYER_1_CONTROLS);
      this.networkInput = new NetworkInput(this);
      this.networkSync = new NetworkSync(this, this.playerKey);
    } else {
      this.player1Input = new Input(this, 'ibb', PLAYER_1_CONTROLS);
      this.player2Input = new Input(this, 'obb', PLAYER_2_CONTROLS);
    }

    this.matter.world.setBounds(0, 0, levelWidth, levelHeight, BORDER_THICKNESS);
    this.cameras.main.setBounds(0, 0, levelWidth, levelHeight);
    this.cameras.main.roundPixels = true;
    // this.addBackgrounds();
    this.addParallax();
    this.addWalls();

    // interactive level objects
    this.movingPlatform1 = new MovingPlatform(this, 6500, 1330, 'platform-long', 1100, 'horizontal');
    this.movingPlatform2 = new MovingPlatform(this, 10000, 1800, 'platform-long', -1580, 'vertical');

    // Entourage
    this.grassSet = new LevelsEntourage(this, 1, 0, 1444, 1, 'grassSet02', false, false, 101, 3500);
    this.grassSet = new LevelsEntourage(this, 1, 300, 1444, 1, 'grassSet02', false, false, 98, 1600);
    this.grassSet = new LevelsEntourage(this, 1, 680, 1444, 1, 'grassSet01', false, true, 101, 800);
    this.grassSet = new LevelsEntourage(this, 1, 683, 1444, 1, 'grassSet02', false, false, 98, 1800);

    this.grassSet = new LevelsEntourage(this, 1, 280, 1444, 1, 'grassSet02', true, false, 101, 3500);
    this.grassSet = new LevelsEntourage(this, 1, 360, 1444, 1, 'grassSet02', true, false, 98, 1600);
    this.grassSet = new LevelsEntourage(this, 1, 680, 1444, 1, 'grassSet01', true, true, 101, 800);
    this.grassSet = new LevelsEntourage(this, 1, 683, 1444, 1, 'grassSet02', true, false, 98, 1800);

    this.grassSet = new LevelsEntourage(this, 1, 280, 1457, 1, 'grassUnderWorldSet02', true, false, 101, 3500);
    this.grassSet = new LevelsEntourage(this, 1, 420, 1457, 1, 'grassUnderWorldSet02', true, false, 98, 600);
    this.grassSet = new LevelsEntourage(this, 1, 680, 1457, 1, 'grassUnderWorldSet02', true, false, 101, 800);
    this.grassSet = new LevelsEntourage(this, 1, 984, 1457, 1, 'grassUnderWorldSet02', true, false, 98, 2800);

    this.grassSet = new LevelsEntourage(this, 1, 1199, 1380, 1, 'grassSet01', false, false, 101, 1100);
    this.grassSet = new LevelsEntourage(this, 1, 1512, 1380, 1, 'grassSet01', true, false, 101, 1400);
    this.grassSet = new LevelsEntourage(this, 1, 1205, 1380, 1, 'grassSet02', false, false, 101, 1500);
    this.grassSet = new LevelsEntourage(this, 1, 1520, 1380, 1, 'grassSet02', true, false, 101, 900);

    this.grassSet = new LevelsEntourage(this, 0.96, 1522, 1392, 1, 'grassUnderWorldSet01', true, false, 101, 1200);
    this.grassSet = new LevelsEntourage(this, 0.6, 1522, 1486, 1, 'grassSet02', false, false, 101, 800);
    this.grassSet = new LevelsEntourage(this, 0.65, 1711, 1484, 1, 'grassSet02', true, false, 101, 1800);

    this.tree = new LevelsEntourage(this, 1, 100, 1442, 25, 'boabab01', false, true, 100, 2000);
    this.tree = new LevelsEntourage(this, 1, 200, 1442, 25, 'palm02', false, true, 0, 850);
    this.tree = new LevelsEntourage(this, 1, 200, 1442, 25, 'boabab02', false, false, 0, 1850);
    this.tree = new LevelsEntourage(this, 1, 300, 1442, 25, 'boabab03', false, false, 0, 1000);
    this.tree = new LevelsEntourage(this, 1, 500, 1442, 25, 'boabab05', false, false, 96, 1500);
    this.tree = new LevelsEntourage(this, 1, 700, 1442, 25, 'boabab06', false, false, 0, 3000);
    this.tree = new LevelsEntourage(this, 1, 930, 1442, 25, 'palm06', false, false, 0, 1000);

    this.tree = new LevelsEntourage(this, 1, 1319, 1378, 25, 'boabab01', false, false, 0, 1200);
    this.tree = new LevelsEntourage(this, 1, 1419, 1378, 25, 'palm02', false, false, 100, 1500);

    this.grassSet = new LevelsEntourage(this, 1, 1711, 1638, 1, 'grassSet02', false, false, 98, 1800);
    this.grassSet = new LevelsEntourage(this, 1, 2031, 1638, 1, 'grassSet01', false, false, 98, 800);
    this.grassSet = new LevelsEntourage(this, 1, 2361, 1638, 1, 'grassSet02', false, true, 98, 600);
    this.grassSet = new LevelsEntourage(this, 1, 2361, 1638, 1, 'grassSet02', false, false, 101, 1200);
    this.grassSet = new LevelsEntourage(this, 1, 2031, 1638, 1, 'grassSet02', true, false, 98, 300);
    this.grassSet = new LevelsEntourage(this, 1, 2331, 1638, 1, 'grassSet01', true, false, 98, 500);
    this.grassSet = new LevelsEntourage(this, 1, 2661, 1638, 1, 'grassSet02', true, false, 101, 1400);
    this.grassSet = new LevelsEntourage(this, 1, 2568, 1638, 1, 'grassSet02', true, true, 98, 800);
    this.grassSet = new LevelsEntourage(this, 1, 2361, 1638, 1, 'flowersSet01', false, false, 101, 1100);
    this.grassSet = new LevelsEntourage(this, 1, 2888, 1638, 1, 'grassSet01', false, true, 101, 500);
    this.grassSet = new LevelsEntourage(this, 0.27, 2988, 1638, 1, 'grassSet02', false, false, 101, 1800);

    this.grassSet = new LevelsEntourage(this, 1, 2017, 1650, 1, 'grassUnderWorldSet01', true, false, 98, 1100);
    this.grassSet = new LevelsEntourage(this, 1, 2331, 1650, 1, 'grassUnderWorldSet02', true, true, 98, 500);
    this.grassSet = new LevelsEntourage(this, 1, 2331, 1650, 1, 'grassUnderWorldSet02', true, false, 101, 300);
    this.grassSet = new LevelsEntourage(this, 1, 2566, 1650, 1, 'grassUnderWorldSet02', true, true, 101, 1250);
    this.grassSet = new LevelsEntourage(this, 1, 2566, 1650, 1, 'grassUnderWorldSet02', true, true, 101, 1800);

    this.grassSet = new LevelsEntourage(this, 0.31, 3087, 1761, 1, 'grassUnderWorldSet02', true, false, 101, 800);

    this.tree = new LevelsEntourage(this, 1, 2021, 1651, 25, 'curved01', true, false, 0, 1300);
    this.tree = new LevelsEntourage(this, 1, 2166, 1651, 25, 'palm03', true, false, 0, 1000);
    this.tree = new LevelsEntourage(this, 1, 2466, 1651, 25, 'curved03', true, false, 0, 1500);
    this.tree = new LevelsEntourage(this, 1, 2566, 1651, 25, 'curved02', true, false, 0, 1200);

    this.grassSet = new LevelsEntourage(this, 1, 3053, 1285, 1, 'grassSet01', false, false, 101, 1300);
    this.grassSet = new LevelsEntourage(this, 1, 3298, 1285, 1, 'grassSet01', false, false, 101, 700);
    this.grassSet = new LevelsEntourage(this, 1, 3353, 1285, 1, 'grassSet02', true, false, 101, 1300);
    this.grassSet = new LevelsEntourage(this, 1, 3618, 1285, 1, 'grassSet02', true, false, 101, 1700);
    this.grassSet = new LevelsEntourage(this, 1, 3053, 1298, 1, 'grassUnderWorldSet02', true, true, 101, 1200);
    this.grassSet = new LevelsEntourage(this, 1, 3278, 1298, 1, 'grassUnderWorldSet01', true, true, 101, 1500);
    this.tree = new LevelsEntourage(this, 1, 3153, 1284, 25, 'curved02', true, false, 0, 1000);
    this.tree = new LevelsEntourage(this, 1, 3153, 1284, 25, 'curved01', false, true, 0, 2000);
    this.tree = new LevelsEntourage(this, 1, 3253, 1284, 25, 'boabab04', false, false, 0, 1200);
    this.tree = new LevelsEntourage(this, 1, 3353, 1284, 25, 'boabab05', false, false, 0, 1500);

    this.tree = new LevelsEntourage(this, 1, 3729, 1584, 25, 'palm03', true, false, 0, 1200);
    this.tree = new LevelsEntourage(this, 1, 3786, 1568, 25, 'palm04', false, false, 0, 2000);
    this.tree = new LevelsEntourage(this, 1, 3890, 1584, 25, 'palm02', true, true, 0, 1600);

    this.grassSet = new LevelsEntourage(this, 1, 3616, 1570, 1, 'grassSet02', false, false, 101, 1200);
    this.grassSet = new LevelsEntourage(this, 1, 3758, 1570, 1, 'grassSet01', false, false, 101, 1500);
    this.grassSet = new LevelsEntourage(this, 1, 3980, 1570, 1, 'grassSet01', true, false, 101, 900);
    this.grassSet = new LevelsEntourage(this, 1, 4058, 1570, 1, 'grassSet01', true, false, 101, 1600);
    this.grassSet = new LevelsEntourage(this, 1, 3600, 1582, 1, 'grassUnderWorldSet01', true, true, 101, 1600);
    this.grassSet = new LevelsEntourage(this, 1, 3770, 1582, 1, 'grassUnderWorldSet02', true, true, 101, 1800);

    this.grassSet = new LevelsEntourage(this, 0.82, 4075, 1483, 1, 'grassSet02', false, false, 101, 800);
    this.grassSet = new LevelsEntourage(this, 0.82, 4335, 1483, 1, 'grassSet01', true, false, 101, 1800);
    this.grassSet = new LevelsEntourage(this, 0.82, 4072, 1483, 1, 'flowersSet01', false, false, 101, 1200);
    this.grassSet = new LevelsEntourage(this, 0.82, 4272, 1483, 1, 'flowersSet01', false, true, 101, 900);
    this.grassSet = new LevelsEntourage(this, 0.82, 4172, 1483, 1, 'flowersSet01', false, false, 101, 1500);
    this.grassSet = new LevelsEntourage(this, 1, 4200, 1483, 1, 'flowersSet01', false, false, 101, 1100);
    this.grassSet = new LevelsEntourage(this, 0.82, 4350, 1494, 1, 'grassUnderWorldSet01', true, false, 101, 1800);

    this.grassSet = new LevelsEntourage(this, 0.51, 4334, 1402, 1, 'grassSet02', false, false, 101, 1600);
    this.grassSet = new LevelsEntourage(this, 0.51, 4498, 1402, 1, 'grassSet02', true, false, 101, 1600);
    this.grassSet = new LevelsEntourage(this, 0.45, 4493, 1414, 1, 'grassUnderWorldSet02', true, false, 101, 1000);
    this.grassSet = new LevelsEntourage(this, 0.36, 4681, 1402, 1, 'grassSet02', false, false, 101, 1800);
    this.grassSet = new LevelsEntourage(this, 0.36, 4797, 1402, 1, 'grassSet02', true, false, 101, 800);
    this.grassSet = new LevelsEntourage(this, 0.4, 4809, 1414, 1, 'grassUnderWorldSet02', true, false, 101, 1100);

    this.grassSet = new LevelsEntourage(this, 1.1, 4794, 1254, 1, 'grassSet02', false, false, 101, 2000);
    this.grassSet = new LevelsEntourage(this, 1.1, 5140, 1254, 1, 'grassSet02', true, false, 101, 2000);
    this.grassSet = new LevelsEntourage(this, 1.04, 5141, 1266, 1, 'grassUnderWorldSet01', true, false, 101, 1100);

    this.grassSet = new LevelsEntourage(this, 1, 5328, 1254, 1, 'grassSet01', false, false, 101, 1100);
    this.grassSet = new LevelsEntourage(this, 1, 5646, 1254, 1, 'grassSet02', true, false, 101, 1100);
    this.grassSet = new LevelsEntourage(this, 1, 5648, 1266, 1, 'grassUnderWorldSet02', true, false, 101, 1500);
    this.grassSet = new LevelsEntourage(this, 1, 5610, 1254, 1, 'grassSet02', false, false, 101, 1300);
    this.grassSet = new LevelsEntourage(this, 1, 5930, 1254, 1, 'grassSet02', true, false, 101, 1300);
    this.grassSet = new LevelsEntourage(this, 1, 5945, 1266, 1, 'grassUnderWorldSet01', true, false, 101, 1600);
    this.grassSet = new LevelsEntourage(this, 1, 5770, 1254, 1, 'flowersSet01', false, false, 101, 1300);

    this.tree = new LevelsEntourage(this, 1, 5658, 1267, 25, 'boabab01', true, false, 100, 3000);
    this.tree = new LevelsEntourage(this, 1, 5610, 1253, 25, 'palm04', false, false, 0, 3000);
    this.tree = new LevelsEntourage(this, 1, 5428, 1253, 25, 'palm02', false, true, 0, 3000);

    this.grassSet = new LevelsEntourage(this, 0.19, 5928, 971, 1, 'grassSet02', false, false, 101, 700);
    this.grassSet = new LevelsEntourage(this, 0.19, 5988, 971, 1, 'grassSet02', true, false, 101, 700);
    this.grassSet = new LevelsEntourage(this, 0.545, 6058, 971, 1, 'grassSet02', false, false, 101, 700);
    this.grassSet = new LevelsEntourage(this, 0.545, 6230, 971, 1, 'grassSet02', true, false, 101, 700);
    this.grassSet = new LevelsEntourage(this, 0.85, 6218, 982, 1, 'grassUnderWorldSet02', true, false, 101, 1800);

    this.grassSet = new LevelsEntourage(this, 0.47, 7730, 1316, 1, 'grassSet02', false, false, 101, 500);
    this.grassSet = new LevelsEntourage(this, 0.47, 7877, 1316, 1, 'grassSet01', true, false, 101, 500);
    this.grassSet = new LevelsEntourage(this, 0.47, 7878, 1329, 1, 'grassUnderWorldSet02', true, false, 101, 1200);
    this.tree = new LevelsEntourage(this, 1, 7760, 1314, 1, 'boabab03', false, false, 100, 1820);

    this.grassSet = new LevelsEntourage(this, 0.2, 7899, 1189, 1, 'grassSet02', false, false, 101, 500);
    this.grassSet = new LevelsEntourage(this, 0.2, 7961, 1189, 1, 'grassSet02', true, false, 101, 500);
    this.tree = new LevelsEntourage(this, 1, 7939, 1189, 1, 'palm06', false, true, 1, 500);

    this.tree = new LevelsEntourage(this, 1, 9469, 632, 1, 'boabab05', false, false, 100, 1820);
    this.grassSet = new LevelsEntourage(this, 0.22, 9478, 634, 1, 'grassSet02', false, false, 101, 500);
    this.grassSet = new LevelsEntourage(this, 0.22, 9550, 634, 1, 'grassSet02', true, false, 101, 500);
    // level 1 finish
    this.grassSet = new LevelsEntourage(this, 1, 10199, 166, 1, 'grassSet01', false, false, 101, 1100);
    this.grassSet = new LevelsEntourage(this, 1, 10299, 166, 1, 'flowersSet01', false, false, 101, 1200);
    this.grassSet = new LevelsEntourage(this, 1, 10219, 166, 1, 'flowersSet01', false, false, 0, 1300);
    this.grassSet = new LevelsEntourage(this, 1, 10399, 166, 1, 'flowersSet01', false, true, 98, 1600);
    this.grassSet = new LevelsEntourage(this, 1, 10239, 166, 1, 'flowersSet01', false, false, 98, 800);
    this.grassSet = new LevelsEntourage(this, 1, 10389, 166, 1, 'flowersSet01', false, false, 0, 1800);

    // ibb & obb spawn
    this.obb = new Player(this, 'obb', 225, 1100, 'obb-sprite', COLLISION_CATEGORIES.obb);
    this.ibb = new Player(this, 'ibb', 240, 1160, 'ibb-sprite', COLLISION_CATEGORIES.ibb);
    this.ibb.headStandingCheck();
    this.obb.headStandingCheck();

    // lvl 2 gate
    const color = Phaser.Display.Color.IntegerToRGB(0xddddff);
    const light = this.add.pointlight(
      10490, 100,
      10, 280, 1,
    );
    light.depth = 100;
    light.color.setTo(color.r, color.g, color.b);

    this.levelEnd = new LevelEnd(this, 10500, 0);
    // enemies spawn
    // enemies set 1
    this.hedgehog1 = new JumpingHedgehog(this, 1125, 1900, 'hedgehog-jumper', 'hedgehog-fullbutt');
    this.hedgehog1.moveHorizontally(50, 'left', 250);
    this.hedgehog1.jump(800, 1200);
    this.hedgehog2 = new StandartHedgehog(this, 1450, 1356, 'hedgehog-head', 'hedgehog-halfbutt');
    this.hedgehog2.moveHorizontally(185, 'left', 1800);
    // enemies set 2
    this.hedgehog3 = new JumpingHedgehog(this, 2000, 1592, 'hedgehog-jumper', 'hedgehog-fullbutt');
    this.hedgehog3.jump(50, 800);
    this.hedgehog4 = new JumpingHedgehog(this, 2150, 1694, 'hedgehog-jumper', 'hedgehog-fullbutt', true, 100);
    this.hedgehog4.jump(180, 700);
    this.hedgehog5 = new JumpingHedgehog(this, 2300, 1592, 'hedgehog-jumper', 'hedgehog-fullbutt');
    this.hedgehog5.jump(180, 900);
    this.hedgehog6 = new JumpingHedgehog(this, 2450, 1592, 'hedgehog-jumper', 'hedgehog-fullbutt');
    this.hedgehog6.jump(180, 500);
    this.hedgehog7 = new JumpingHedgehog(this, 2600, 1695, 'hedgehog-jumper', 'hedgehog-fullbutt', true);
    this.hedgehog7.jump(15090, 5600);
    this.hedgehog8 = new JumpingHedgehog(this, 2750, 1592, 'hedgehog-jumper', 'hedgehog-fullbutt');
    this.hedgehog8.jump(180, 450);
    // enemies set 3
    this.hedgehog9 = new StandartHedgehog(this, 3400, 1322, 'hedgehog-head', 'hedgehog-halfbutt', true);
    this.hedgehog9.moveHorizontally(300, 'left', 2500, 'Bounce', 'Out');
    this.hedgehog10 = new StandartHedgehog(this, 3550, 1322, 'hedgehog-head', 'hedgehog-halfbutt', true);
    this.hedgehog10.moveHorizontally(300, 'left', 2500, 'Bounce', 'In');
    // enemies set 4
    this.hedgehog11 = new StandartHedgehog(this, 4290, 1457, 'hedgehog-head', 'hedgehog-halfbutt');
    this.hedgehog11.moveHorizontally(150, 'left', 1000);
    this.hedgehog12 = new JumpingHedgehog(this, 4950, 1120, 'hedgehog-jumper', 'hedgehog-fullbutt', true, 85);
    this.hedgehog12.moveHorizontally(100, 'left', 300);
    this.hedgehog12.jump(50, 1500);
    // enemies set 5
    this.hedgehog13 = new JumpingHedgehog(this, 5860, 860, 'hedgehog-jumper', 'hedgehog-fullbutt', true, 85);
    this.hedgehog13.moveHorizontally(10, 'left', 300);
    this.hedgehog13.jump(150, 1500);
    this.hedgehog14 = new StandartHedgehog(this, 6030, 945, 'hedgehog-head', 'hedgehog-halfbutt');
    this.hedgehog14.moveHorizontally(0.1, 'left', 5000);
    // enemies set 6
    this.hedgehog15 = new JumpingHedgehog(this, 6920, 1230, 'hedgehog-jumper', 'hedgehog-fullbutt', false, -100, 100);
    this.hedgehog15.jump(4, 1500);
    this.hedgehog16 = new JumpingHedgehog(this, 7520, 1265, 'hedgehog-jumper', 'hedgehog-fullbutt', false, -100, 100);
    this.hedgehog16.jump(80, 300);

    playMusic(this);
    this.events.off('GameOver');
    this.events.on('GameOver', () => {
      this.time.addEvent({
        delay: 2500,
        callback: () => {
          this.scene.start('GameOver');
        },
      });
    });

    this.score = new Score(this);
    this.input.keyboard.addKey('ESC').on('down', () => {
      this.scene.switch('GameMenu');
    });
  }

  addParallax() {
    this.parallax = {};
    Object.entries(parallaxImages).forEach(([key, speed]) => {
      const sprite = this.add.tileSprite(
        -50,
        -32,
        this.game.config.width + 100,
        this.game.config.height + 64,
        key,
      )
        .setOrigin(0, 0)
        .setScrollFactor(0);

      this.parallax[key] = { key, sprite, speed };
    });
  }

  setDirection(key, direction, state) {
    this[key].directions[direction] = state;
  }

  scrollParallax() {
    this.myCam = this.cameras.main;
    Object.values(this.parallax).forEach((item) => {
      const { sprite, speed } = item;
      if (speed) sprite.tilePositionX = this.cameras.main.scrollX * speed;
    });
  }

  addBackgrounds() {
    // main background
    this.background = this.add.graphics();
    this.background.fillGradientStyle(0x3C6771, 0xB3B061, 0x3C6771, 0xB3B061, 1);
    this.background.fillRect(0, 0, levelWidth, levelHeight);
    // underworld backgrounds
    gradientSquares.forEach((item, index) => {
      const {
        width,
        height,
      } = item;
      const top = levelHeight - height;
      let left = 0;
      let i = index;
      while (i > 0) {
        i -= 1;
        left += gradientSquares[i].width;
      }
      const startColor = gradientColors[index];
      const endColor = gradientColors[index + 1];
      const bg = this.add.graphics();
      bg.fillGradientStyle(startColor, endColor, startColor, endColor, 1);
      bg.fillRect(left, top, width, height);
    });
  }

  addWalls() {
    const wallDefaultColor = 0x062C42;
    const portalColor = 0xffffff;
    const wallDefaultHeight = 16;

    walls.forEach((item) => {
      const {
        width,
        y,
        x,
        isPortal,
        isVertical,
        collisionGroup,
      } = item;
      const top = y - wallDefaultHeight;
      const wallHeight = isVertical ? width : wallDefaultHeight;
      const wallWidth = isVertical ? wallDefaultHeight : width;
      const wallColor = isPortal ? portalColor : wallDefaultColor;
      const wallX = x + wallWidth / 2;
      const wallY = top + wallHeight / 2;
      // these and other options should be configured for proper physic behaviour
      const objSettings = {
        isSensor: isPortal,
        isStatic: true,
        slop: -1,
      };
      if (isPortal) {
        // moved portal to separate class for better detection in collision event with instanceof
        const portal = new Portal(
          this, wallX, wallY,
          wallWidth, wallHeight, wallColor,
          isVertical, objSettings, collisionGroup,
        );
        this.portals.push(portal);
      } else {
        const wall = this.add.rectangle(wallX, wallY, wallWidth, wallHeight, wallColor);
        const wallGameObject = this.matter.add.gameObject(wall, objSettings);
        wallGameObject.setCollisionCategory(COLLISION_CATEGORIES.wall);
      }
    });
  }

  centerCamera() {
    if (this.ibb.isAlive && this.obb.isAlive) {
      const cam = this.cameras.main;
      const ibbCoords = {
        x: this.ibb.sensors.bottom.position.x,
        y: this.ibb.sensors.bottom.position.y,
      };
      const obbCoords = {
        x: this.obb.sensors.bottom.position.x,
        y: this.obb.sensors.bottom.position.y,
      };
      const charactersXDiff = Math.abs(obbCoords.x - ibbCoords.x);
      const charactersYDiff = Math.abs(obbCoords.y - ibbCoords.y);
      const camZoom = 1 - 0.05 * (charactersXDiff / cam.width);
      const closestToLeftCharacterX = ibbCoords.x > obbCoords.x ? obbCoords.x : ibbCoords.x;
      const closestToTopCharacterY = ibbCoords.y > obbCoords.y ? obbCoords.y : ibbCoords.y;
      const cameraX = parseInt(charactersXDiff / 2 + closestToLeftCharacterX, 10);
      const cameraY = parseInt(charactersYDiff / 2 + closestToTopCharacterY, 10);
      if (camZoom !== cam.zoom) cam.setZoom(camZoom);
      cam.pan(cameraX, cameraY, 100);
      this.charactersDistance = charactersXDiff;
    }
  }

  checkIfPlayersAreAtFinish() {
    if (this.ibb.atLevelFinish && this.obb.atLevelFinish) this.levelEnd.completeLevel();
  }

  update() {
    if (!this.game.isStarted) this.game.isStarted = true;
    if (this.ibb && this.obb) {
      this.centerCamera();
      this.scrollParallax();
    }
    if (this.online) this.networkSync.sync();
    this.checkIfPlayersAreAtFinish();
  }

  gameMenu() {
    this.cursors.space.on('down', () => {
      // this.scene.pause('Score');
      this.scene.switch('GameMenu');
    });
  }
}
