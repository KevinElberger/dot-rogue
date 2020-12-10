import * as HID from 'node-hid';
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
  arraysEqual,
  getRandomArbitrary,
  wait
} from '../utils.js';
import Player from './Player.js';

export default class Game {
  level = 1;
  player = null;
  dungeon = null;
  debug = false;
  pi = false;
  gameOver = false;
  matrix = new LedMatrix(matrixOptions, runtimeOptions);
  map = Array(MAP_HEIGHT).fill().map(() => Array(MAP_WIDTH));

  constructor({ debug } = options) {
    this.debug = debug;
  }

  init() {
    this.dungeon = new Dungeon(this.map).create();
    this.setPlayerLocation();
    this.drawMatrix();
    
    setTimeout(() => {
      this.player.x = this.player.x + 1;
      this.drawMatrix();
    }, 2000);

    if (this.debug) {
      this.dungeon.drawMap();
    }
  }

  gameTick() {
    return;
    const up = arraysEqual(data.data, BUTTON.UP);
    const down = arraysEqual(data.data, BUTTON.DOWN);
    const left = arraysEqual(data.data, BUTTON.LEFT);
    const right = arraysEqual(data.data, BUTTON.RIGHT);
    const pos = { x: this.player.x, y: this.player.y };

    if (!up && !down && !left && !right) return;

    if (up) pos.x += -1;
    if (down) pos.x += 1;
    if (left) pos.y += -1;
    if (right) pos.y += 1;

    if (this.isValidMove(pos.x, pos.y)) {
      this.movePlayer(pos);
      this.drawMatrix();
    }
  }

  setPlayerLocation() {
    const rng = getRandomArbitrary(0, this.dungeon.rooms.length - 1);
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
    (async () => {
      try {
        this.matrix.clear();

        this.matrix.afterSync((mat, dt, t) => {
          this.matrix.map(([x, y, i]) => {
            const player = x === this.player.x && y === this.player.y;
            if (this.map[x][y] && !player) {
              return COLORS.cyan;
            } else if (this.map[x][y] && player) {
              return COLORS.magenta;
            }
            return 0x000000;
          });
          
          setTimeout(() => this.matrix.sync(), 10000);
        });

        this.matrix.sync();
      } catch(error) {
        console.log(error);
      }
    })();
  }

  isValidMove(x, y) {
    return x >= 0 && y >= 0 && x < MAP_HEIGHT && y < MAP_WIDTH && this.map[x][y];
  }
}
