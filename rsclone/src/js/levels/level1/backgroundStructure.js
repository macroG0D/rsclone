const portalWidth = 186;
const gradientSquares = [
  {
    width: 1506,
    height: 432,
  },
  {
    width: 191,
    height: 355,
  },
  {
    width: 1292,
    height: 254,
  },
  {
    width: 1086,
    height: 310,
  },
  {
    width: 260,
    height: 410,
  },
  {
    width: 458,
    height: 490,
  },
  {
    width: 576,
    height: 638,
  },
];
const gradientColors = [
  0x0D2E3B,
  0x243E51,
  0x254052,
  0x57707C,
  0x6B838D,
  0x708692,
  0x788E99,
  0x8296A2,
];

const walls = [
  {
    width: 1506,
    y: 458,
    x: 0,
    isPortal: false,
    isVertical: false,
  },
  {
    width: 93,
    y: 458,
    x: 1506,
    isPortal: false,
    isVertical: true,
  },
  {
    width: 191,
    y: 551,
    x: 1506,
    isPortal: false,
    isVertical: false,
  },
  {
    width: 191,
    y: 551,
    x: 1506,
    isPortal: false,
    isVertical: false,
  },
  {
    width: 101,
    y: 551,
    x: 1697,
    isPortal: false,
    isVertical: true,
  },
  {
    width: 1292,
    y: 652,
    x: 1697,
    isPortal: false,
    isVertical: false,
  },
  {
    width: 72,
    y: 596,
    x: 2989,
    isPortal: false,
    isVertical: true,
  },
  {
    width: 600,
    y: 596,
    x: 2989,
    isPortal: false,
    isVertical: false,
  },
  {
    width: portalWidth,
    y: 596,
    x: 3589,
    isPortal: true,
    isVertical: false,
  },
  {
    width: 300,
    y: 596,
    x: 3775,
    isPortal: false,
    isVertical: false,
  },
  {
    width: 116,
    y: 496,
    x: 4075,
    isPortal: false,
    isVertical: true,
  },
  {
    width: 260,
    y: 496,
    x: 4075,
    isPortal: false,
    isVertical: false,
  },
  {
    width: 96,
    y: 416,
    x: 4335,
    isPortal: false,
    isVertical: true,
  },
  {
    width: 161,
    y: 416,
    x: 4335,
    isPortal: false,
    isVertical: false,
  },
  {
    width: portalWidth,
    y: 416,
    x: 4496,
    isPortal: true,
    isVertical: false,
  },
  {
    width: 127,
    y: 416,
    x: 4682,
    isPortal: false,
    isVertical: false,
  },
  {
    width: portalWidth,
    y: 232,
    x: 4793,
    isPortal: true,
    isVertical: true,
  },

  {
    width: 64,
    y: 168,
    x: 4793,
    isPortal: false,
    isVertical: true,
  },

  {
    width: 350,
    y: 168,
    x: 4793,
    isPortal: false,
    isVertical: false,
  },
  {
    width: portalWidth,
    y: 168,
    x: 5143,
    isPortal: true,
    isVertical: false,
  },
  {
    width: 40,
    y: 168,
    x: 5329,
    isPortal: false,
    isVertical: false,
  },
];

export { gradientSquares, gradientColors, walls };
