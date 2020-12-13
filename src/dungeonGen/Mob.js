import { MAP_HEIGHT, MAP_WIDTH, TILES } from '../constants.js';
import { getRandomArbitrary, shuffle } from '../utils.js';

export default class Mob {
  x;
  y;
  power = 2;
  health = 3;

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  attack() {
    return getRandomArbitrary(0, this.power);
  }

  closeToPlayer(player) {
    return Math.abs(this.x - player.x) < 4 && Math.abs(this.y - player.y) < 4;
  }

  nextToPlayer(player) {
    return (
      (
        this.x === player.x &&
        Math.abs(this.y - player.y) === 1
      )
      ||
      (
        this.y === player.y &&
        Math.abs(this.x - player.x) === 1
      )
    );
  }

  moveRandom(map) {
    const left = { x: this.x, y: this.y - 1 > 0 ? this.y - 1 : this.y };
    const right = { x: this.x, y: this.y + 1 < MAP_WIDTH ? this.y + 1 : this.y };
    const up = { x: this.x - 1 > 0 ? this.x - 1 : this.x, y: this.y };
    const down = { x: this.x + 1 < MAP_HEIGHT ? this.x + 1 : this.x, y: this.y };
    let directions = [left, right, up, down].filter(dir => {
      return map[dir.x][dir.y] && map[dir.x][dir.y] === TILES.GROUND;
    });

    directions = shuffle(directions);

    if (directions.length && !!map[directions[0].x][directions[0].y]) {
      map[this.x][this.y] = TILES.GROUND;
      this.x = directions[0].x;
      this.y = directions[0].y;
      map[this.x][this.y] = TILES.MOB;
    }
  }

  // There's an algorithm that should handle this instead :)
  moveToPlayer(map, player) {
    let x = this.x;
    let y = this.y;
    const sameRow = this.x === player.x;
    const sameCol = this.y === player.y;
    const playerIsLeft = this.y > player.y;
    const playerIsBelow = this.x < player.x;

    if (sameRow) {
      y += playerIsLeft ? -1 : 1;
    } else if (sameCol) {
      x += playerIsBelow ? 1 : -1;
    } else {
      return this.moveRandom(map);
    }

    if (this.canMove(map, x, y)) {
      map[this.x][this.y] = TILES.GROUND;
      this.x = x;
      this.y = y;
      map[this.x][this.y] = TILES.MOB;
    }
  }

  canMove(map, x, y) {
    return !!map[x][y] && map[x][y] === TILES.GROUND;
  }
}
