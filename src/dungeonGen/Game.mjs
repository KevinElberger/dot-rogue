import { BUTTON, CONTROLLER, MAP_HEIGHT, MAP_WIDTH } from '../constants.js';
import Dungeon from './Dungeon.js';
import * as HID from 'node-hid';
import { arraysEqual, getController, getRandomArbitrary } from '../utils.js';
import Player from './Player.js';
// import { LedMatrix } from 'rpi-led-matrix';

export default class Game {
  level = 1;
  player = null;
  controller = null;
  dungeon = null;
  debug = false;
  pi = false;
  gameOver = false;
  // matrix = new LedMatrix(matrixOptions, runtimeOptions);
  map = Array(MAP_HEIGHT).fill().map(() => Array(MAP_WIDTH));

  constructor({ debug } = options) {
    this.debug = debug;
  }

  init() {
    if (!getController(HID.default.devices())) {
      return console.log('Controller not found');
    }

    this.dungeon = new Dungeon(this.map).create();

    // if (this.debug) {
      this.dungeon.drawMap();
    // }
    this.setPlayerLocation();

    this.controller = new HID.default.HID(getController(HID.default.devices()).path);

    process.on('SIGINT', () => {
      console.log('SIGINT');
      // Prevents early termination from holding onto the HID
      this.controller.close();
    });

    this.controller.on('error', error => {
      console.log(error);
      this.controller.close()
    });
    this.controller.on('data', data => {
      data = JSON.parse(JSON.stringify(data));

      const up = arraysEqual(data.data, BUTTON.UP);
      const down = arraysEqual(data.data, BUTTON.DOWN);
      const left = arraysEqual(data.data, BUTTON.LEFT);
      const right = arraysEqual(data.data, BUTTON.RIGHT);
      const pos = { x: this.player.x, y: this.player.y };

      if (!(up || down || left || right)) return;

      if (up) pos.x += -1;
      if (down) pos.x += 1;
      if (left) pos.y += -1;
      if (right) pos.y += 1;

      if (this.isValidMove(pos.x, pos.y)) {
        console.log('valid move');
      }
    });

    // (async () => {
    //   try {
    //     this.matrix.clear();

    //     this.matrix.afterSync((mat, dt, t) => {
    //         this.matrix.map(([x, y, i]) => {
    //           if (this.map[x][y]) {
    //             return 0xFF00FF;
    //           }
    //           return 0x000000;
    //         });
    //     });

    //     this.matrix.sync();

    //     await wait(999999999);
    //   } catch(error) {
    //     console.log(error);
    //   }
    // })();
  }

  setPlayerLocation() {
    const rng = getRandomArbitrary(0, this.dungeon.rooms.length - 1);
    const room = this.dungeon.rooms[rng];

    room.startingRoom = true;
    this.player = new Player(room.center[0], room.center[1]);
  }

  isValidMove(x, y) {
    return x >= 0 && y >= 0 && x < MAP_HEIGHT && y < MAP_WIDTH && this.map[x][y];
  }
}
