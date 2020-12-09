// import { LedMatrix, GpioMapping } from 'rpi-led-matrix';

export const BUTTON = {
  X: [1, 0, 128, 0, 128, 0, 128, 0, 128, 0, 0, 0, 0, 0, 8, 0],
  Y: [1, 0, 128, 0, 128, 0, 128, 0, 128, 0, 0, 0, 0, 0, 4, 0],
  B: [1, 0, 128, 0, 128, 0, 128, 0, 128, 0, 0, 0, 0, 0, 1, 0],
  A: [1, 0, 128, 0, 128, 0, 128, 0, 128, 0, 0, 0, 0, 0, 2, 0],
  // UP: [1, 0, 128, 0, 0, 0, 128, 0, 128, 0, 0, 0, 0, 0, 0, 0], -- 8BitDo
  // LEFT: [1, 0, 0, 0, 128, 0, 128, 0, 128, 0, 0, 0, 0, 0, 0, 0], -- 8BitDo
  // RIGHT: [1, 255, 255, 0, 128, 0, 128, 0, 128, 0, 0, 0, 0, 0, 0, 0], -- 8BitDo
  // DOWN: [1, 0, 128, 255, 255, 0, 128, 0, 128, 0, 0, 0, 0, 0, 0, 0], -- 8BitDo
  UP: [1, 128, 0, 128, 128, 8, 0, 0, 0, 0],
  LEFT: [1, 0, 128, 128, 128, 8, 0, 0, 0, 0],
  RIGHT: [1, 255, 128, 128, 128, 8, 0, 0, 0, 0],
  DOWN: [1, 128, 255, 128, 128, 8, 0, 0, 0, 0],
  SELECT: [1, 0, 128, 0, 128, 0, 128, 0, 128, 0, 0, 0, 0, 0, 64, 0],
  START: [1, 0, 128, 0, 128, 0, 128, 0, 128, 0, 0, 0, 0, 0, 128, 0]
};

export const TILE_HEIGHT = 1;
export const TILE_WIDTH = 1;
export const MAP_WIDTH = 32;
export const MAP_HEIGHT = 32;

export const TILES = {
  VOID: ',',
  GROUND: 'x',
  PLAYER: 'P',
  STAIRS: 'S',
  WALL: 2
};

export const COLORS = {
  black: 0x000000,
  red: 0xFF0000,
  green: 0x00FF00,
  blue: 0x0000FF,
  magenta: 0xFF00FF,
  cyan: 0x00FFFF,
  yellow: 0xFFFF00,
};

export const CONTROLLER = {
  vid: 1118,
  pid: 736
};

export const matrixOptions = {
  // ...LedMatrix.defaultMatrixOptions(),
  // hardwareMapping: GpioMapping.AdafruitHat,
  rows: 32,
  cols: 32,
  chainLength: 1,
  parallel: 1,
};

export const runtimeOptions = {
  // ...LedMatrix.defaultRuntimeOptions(),
  gpioSlowdown: 4,
};
