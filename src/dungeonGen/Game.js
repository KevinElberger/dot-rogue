import { LedMatrix } from 'rpi-led-matrix';
import {
  MAP_HEIGHT,
  MAP_WIDTH,
  matrixOptions,
  runtimeOptions
} from '../constants.js';
import Dungeon from './Dungeon.js';

const wait = t => new Promise(ok => setTimeout(ok, t));

export default class Game {
  level = 1;
  player = null;
  controller = null;
  dungeon = null;
  matrix = new LedMatrix(matrixOptions, runtimeOptions);
  map = Array(MAP_HEIGHT).fill().map(() => Array(MAP_WIDTH));

  constructor() {
    this.dungeon = new Dungeon(this.map);
  }

  init() {
    this.create();
    
    (async () => {
      try {
        this.matrix.clear();
        
        this.matrix.afterSync((mat, dt, t) => {
            this.matrix.map(([x, y, i]) => {
              if (this.map[x][y]) {
                return 0xFF00FF;
              }
              return 0x000000;
            });
        });
        
        this.matrix.sync();
        
        await wait(999999999);
      } catch(error) {
        console.log(error);
      }
    })();
  }

  create() {
    this.dungeon.create();
    // this.dungeon.drawMap();
  }

  update() { }
}
