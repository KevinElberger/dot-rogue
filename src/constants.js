import { LedMatrix, GpioMapping } from 'rpi-led-matrix';

export const ONE_MINUTE = 60000;
export const TILE_HEIGHT = 1;
export const TILE_WIDTH = 1;
export const MAP_WIDTH = 32;
export const MAP_HEIGHT = 32;

export const TILES = {
  VOID: ',',
  GROUND: 'x',
  PLAYER: 'P',
  STAIRS: 'S',
  MOB: 'M',
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
  orange: 0xFF8000,
};

export const matrixOptions = {
  ...LedMatrix.defaultMatrixOptions(),
  hardwareMapping: GpioMapping.AdafruitHat,
  rows: 32,
  cols: 32,
  chainLength: 1,
  parallel: 1,
};

export const runtimeOptions = {
  ...LedMatrix.defaultRuntimeOptions(),
  gpioSlowdown: 4,
};
