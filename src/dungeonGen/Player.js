import { getRandomArbitrary } from '../utils.js';

export default class Player {
  x;
  y;
  power = 3;
  health = 5;

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  attack() {
    return getRandomArbitrary(0, this.power);
  }
}
