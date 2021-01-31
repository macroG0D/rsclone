import { walls as level1Walls } from './level1/backgroundStructure';
import { walls as level2Walls } from './level2/backgroundStructure';
import { LEVEL_ENTOURAGE as level1Entourage } from './level1/entourage';
import { LEVEL_ENTOURAGE as level2Entourage } from './level2/entourage';
import { LEVEL_ENEMIES as level1Enemies } from './level1/enemies';
import { LEVEL_ENEMIES as level2Enemies } from './level2/enemies';

export const LEVELS = {
  Level1: {
    order: 1,
    width: 10500,
    height: 2890,
    end: {
      x: 10500,
      y: 0,
    },
    walls: level1Walls,
    entourage: level1Entourage,
    enemies: level1Enemies,
    spawn: {
      ibb: { x: 240, y: 1160 },
      obb: { x: 220, y: 1100 },
    },
  },
  Level2: {
    order: 2,
    width: 10500,
    height: 2890,
    end: {
      x: 10500,
      y: 0,
    },
    walls: level2Walls,
    entourage: level2Entourage,
    enemies: level2Enemies,
    spawn: {
      ibb: { x: 240, y: 1160 },
      obb: { x: 220, y: 1100 },
    },
  },
  shared: {
    parallaxImages: {
      sky: 0.2,
      clouds_0: 0.1,
      bg_0: 0.1,
      bg_1: 0.2,
      bg_2: 0.3,
    },
  },
};

export default LEVELS;
