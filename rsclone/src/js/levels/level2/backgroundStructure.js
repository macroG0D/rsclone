import { COLLISION_CATEGORIES } from '../../constants';

// const portalWidth = 186;

export const walls = [
  {
    width: 300,
    y: 1458,
    x: 0,
    isPortal: false,
    isVertical: false,
  },
  {
    width: 1500,
    y: 1474,
    x: 284,
    isPortal: false,
    isVertical: true,
  },
  {
    width: 90,
    y: 1410,
    x: 1506,
    isPortal: true,
    isVertical: true,
    collisionGroup: COLLISION_CATEGORIES.ibb,
  },
];

export default walls;
