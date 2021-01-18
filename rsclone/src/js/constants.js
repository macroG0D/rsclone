export const GAME_WIDTH = 1280;
export const GAME_HEIGHT = 720;
export const BORDER_THICKNESS = 16;
export const DEFAULT_MASS = 1;
export const DEFAULT_FRICTION = 0.02;
export const DEFAULT_FRICTION_AIR = 0.02;
export const CONTROL_KEYS_SEQUENCE = ['left', 'right', 'up', 'down'];
export const CHARACTERS_DISTANCE_MAX = GAME_WIDTH;
export const MUSIC_VOLUME = 0.005;
export const SOUND_VOLUME = 0.01;
export const PARTICLES_COLORS = {
  obb: [0xD15C81, 0x97425D, 0x6D3044],
  ibb: [0x59D75C, 0x3F9A42, 0x2F7231],
};
export const COLLISION_CATEGORIES = {
  wall: 2,
  ibb: 4,
  obb: 8,
  visualParticle: 16,
  physicalParticle: 32,
};
