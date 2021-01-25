export const GAME_WIDTH = 1280;
export const GAME_HEIGHT = 720;
export const BORDER_THICKNESS = 16;
export const DEFAULT_MASS = 1;
export const DEFAULT_FRICTION = 0.02;
export const DEFAULT_FRICTION_AIR = 0.02;
export const CONTROL_KEYS_SEQUENCE = ['left', 'right', 'up', 'down'];
export const CHARACTERS_DISTANCE_MAX = GAME_WIDTH;
export const SOUND_WALK_DELAY = { ibb: 200, obb: 300 };
export const PARTICLES_COLORS = {
  obb: [0xF75186, 0xF75186, 0xF8095C],
  ibb: [0x2CC954, 0x6CDD89, 0x00FF42],
};
export const COLLISION_CATEGORIES = {
  wall: 2,
  ibb: 4,
  obb: 8,
  visualParticle: 16,
  physicalParticle: 32,
};
export const SERVER_HOST = 'http://localhost';
export const PLAYER_1_CONTROLS = ['LEFT', 'RIGHT', 'UP', 'DOWN'];
export const PLAYER_2_CONTROLS = ['A', 'D', 'W', 'S'];
