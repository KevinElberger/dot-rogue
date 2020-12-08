import { CONTROLLER, MAP_HEIGHT, MAP_WIDTH } from '../constants.js';
import Dungeon from './Dungeon.js';
import { default as HID } from 'node-hid';
import { getController } from '../utils.js';
import { LedMatrix } from 'rpi-led-matrix';

export default class Game {
  level = 1;
  player = null;
  controller = null;
  dungeon = null;
  debug = false;
  pi = false;
  matrix = new LedMatrix(matrixOptions, runtimeOptions);
  map = Array(MAP_HEIGHT).fill().map(() => Array(MAP_WIDTH));

  constructor({ debug } = options) {
    this.debug = debug;
  }

  init() {
    if (!getController(HID.devices())) {
      return console.log('Controller not found');
    }

    this.dungeon = new Dungeon(this.map).create();

    if (this.debug) {
      this.dungeon.drawMap();
    }
    this.controller = HID.HID(getController(HID.devices()).path);
    console.log(this.controller);
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
}
