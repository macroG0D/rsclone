export const LEVEL_ENEMIES = [
  [
    ['JumpingHedgehog', 1015, 800, 'hedgehog-jumper', 'hedgehog-fullbutt', false, 120, 200, false],
    ['jump', 15, 1200],
  ],
  [
    ['JumpingHedgehog', 1355, 900, 'hedgehog-jumper', 'hedgehog-fullbutt', true, 120, 85, true],
    ['jump', 140, 600],
  ],
  [
    ['JumpingHedgehog', 1725, 800, 'hedgehog-jumper', 'hedgehog-fullbutt', false, 120, 85, false],
    ['jump', 20, 1200],
  ],
  [
    ['JumpingHedgehog', 1925, 800, 'hedgehog-jumper', 'hedgehog-fullbutt', true, 120, 85, false],
    ['moveHorizontally', 100, 'right', 290],
    ['jump', 200, 350],
  ],
  [
    ['JumpingHedgehog', 2225, 800, 'hedgehog-jumper', 'hedgehog-fullbutt', false, 120, 85, false],
    ['moveHorizontally', 100, 'left', 250],
    ['jump', 120, 250],
  ],
  [
    ['StandartHedgehog', 2800, 712, 'hedgehog-head', 'hedgehog-halfbutt'],
    ['moveHorizontally', 45, 'left', 2000],
  ],
  [
    ['StandartHedgehog', 2530, 672, 'hedgehog-head', 'hedgehog-halfbutt', true],
    ['moveHorizontally', 270, 'left', 300],
  ],
];

export default LEVEL_ENEMIES;
