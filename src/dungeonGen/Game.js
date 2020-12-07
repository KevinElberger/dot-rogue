import { MAP_HEIGHT, MAP_WIDTH } from '../constants.js';
import Dungeon from './Dungeon.js';

export default class Game {
  level = 1;
  player = null;
  controller = null;
  dungeon = null;
  map = Array(MAP_WIDTH).fill().map(() => Array(MAP_HEIGHT).fill(','));

  constructor() {
    this.dungeon = new Dungeon(this.map);
  }

  // Preload anything here
  init() {
    this.create();
  }

  create() {
    this.dungeon.create();
    this.dungeon.drawMap();
  }

  update() { }
}
