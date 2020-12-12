import { LedMatrix } from 'rpi-led-matrix';
import {
  MAP_HEIGHT,
  MAP_WIDTH,
  ONE_MINUTE,
  TILES,
  COLORS,
  matrixOptions,
  runtimeOptions
} from '../constants.js';
import Dungeon from './Dungeon.js';
import {
  getRandomArbitrary,
} from '../utils.js';
import Player from './Player.js';

export default class Game {
  level = 1;
  player = null;
  dungeon = null;
  debug = false;
  pi = false;
  gameOver = false;
  matrixTimeout = null;
  matrix = new LedMatrix(matrixOptions, runtimeOptions);
  map = Array(MAP_HEIGHT).fill().map(() => Array(MAP_WIDTH));

  constructor({ debug } = options) {
    this.debug = debug;
  }

  init() {
    this.dungeon = new Dungeon(this.map).create();
    this.setPlayerLocation();
    this.drawMatrix();

    if (this.debug) {
      this.dungeon.drawMap();
    }
  }

  gameTick(direction) {
    const up = direction === 'up';
    const down = direction === 'down';
    const left = direction === 'left';
    const right = direction === 'right';
    const pos = { x: this.player.x, y: this.player.y };

    if (!up && !down && !left && !right) return;

    if (up) pos.x += -1;
    if (down) pos.x += 1;
    if (left) pos.y += -1;
    if (right) pos.y += 1;

    if (this.isValidMove(pos.x, pos.y)) {
      this.movePlayer(pos);
      this.drawMatrix();
      if (this.debug) {
        this.dungeon.drawMap();
      }
      return true;
    }
    return false;
  }

  setPlayerLocation() {
    const rng = getRandomArbitrary(0, this.dungeon.rooms.length - 2); // omit exit room
    const room = this.dungeon.rooms[rng];

    room.startingRoom = true;
    this.player = new Player(room.center[0], room.center[1]);
    this.map[this.player.x][this.player.y] = TILES.PLAYER;
  }

  movePlayer(pos) {
    this.map[this.player.x][this.player.y] = TILES.GROUND;
    this.player.x = pos.x;
    this.player.y = pos.y;
    this.map[pos.x][pos.y] = TILES.PLAYER;
    if (this.debug) {
      this.dungeon.drawMap();
    }
  }

  drawMatrix() {
    if (this.matrixTimeout) {
      clearTimeout(this.matrixTimeout);
    }

    (async () => {
      try {
        this.matrix.clear();
        this.matrix.afterSync((mat, dt, t) => {
          this.matrix.map(([x, y, i]) => this.applyColorsToMatrix(x, y));
          this.matrixTimeout = setTimeout(() => this.matrix.sync(), ONE_MINUTE);
        });
        this.matrix.sync();
      } catch(error) {
        console.log(error);
      }
    })();
  }

  applyColorsToMatrix(x, y) {
    const validTile = this.map[x][y];
    const player = x === this.player.x && y === this.player.y;
    const stairs = this.map[x][y] === TILES.STAIRS;
    const emptyTile = validTile && !player && !stairs;

    if (emptyTile) {
      return COLORS.cyan;
    } else if (validTile && player) {
      return COLORS.magenta;
    } else if (validTile && stairs) {
      return COLORS.orange;
    }
    return COLORS.black;
  }

  isValidMove(x, y) {
    return x >= 0 && y >= 0 && x < MAP_HEIGHT && y < MAP_WIDTH && this.map[x][y];
  }
}
