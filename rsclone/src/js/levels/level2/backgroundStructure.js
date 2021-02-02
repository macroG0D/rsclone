import { COLLISION_CATEGORIES } from '../../constants';

export const walls = [
  {
    width: 300,
    y: 958,
    x: 0,
    isPortal: false,
    isVertical: false,
  },
  {
    width: 170,
    y: 974,
    x: 284,
    isPortal: false,
    isVertical: true,
  },
  {
    width: 145,
    y: 880,
    x: 1006,
    isPortal: true,
    isVertical: true,
    collisionGroup: COLLISION_CATEGORIES.ibb,
  },
  {
    width: 30,
    y: 766,
    x: 2700,
    isPortal: false,
    isVertical: true,
  },
  {
    width: 300,
    y: 920,
    x: 2700,
    isPortal: false,
    isVertical: true,
  },
  {
    width: 150,
    y: 750,
    x: 2700,
    isPortal: false,
    isVertical: false,
  },
  {
    width: 100,
    y: 750,
    x: 2850,
    isPortal: true,
    isVertical: false,
    collisionGroup: COLLISION_CATEGORIES.ibb,
  },
  {
    width: 150,
    y: 750,
    x: 2950,
    isPortal: false,
    isVertical: false,
  },
  // floor 2
  {
    width: 214,
    y: 500,
    x: 2386,
    isPortal: false,
    isVertical: false,
  },
  {
    width: 134,
    y: 516,
    x: 2584,
    isPortal: true,
    isVertical: true,
    collisionGroup: COLLISION_CATEGORIES.obb,
  },
  {
    width: 650,
    y: 0,
    x: 2200,
    isPortal: false,
    isVertical: true,
  },
  {
    width: 170,
    y: 500,
    x: 2216,
    isPortal: true,
    isVertical: false,
    collisionGroup: COLLISION_CATEGORIES.obb,
  },
  {
    width: 400,
    y: 650,
    x: 2200,
    isPortal: false,
    isVertical: false,
  },
  {
    width: 300,
    y: 35,
    x: 2790,
    isPortal: false,
    isVertical: false,
  },
];

export default walls;
