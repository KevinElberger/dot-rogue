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
import Mob from './Mob.js';

export default class Game {
  level = 0;
  player = null;
  dungeon = null;
  debug = false;
  pi = false;
  mobs = [];
  gameOver = false;
  matrixTimeout = null;
  matrix = new LedMatrix(matrixOptions, runtimeOptions);
  map = Array(MAP_HEIGHT).fill().map(() => Array(MAP_WIDTH));

  constructor({ debug } = options) {
    this.debug = debug;
  }

  init() {
    this.createLevel();
  }

  gameTick(direction) {
    if (this.gameOver) return;

    if (!direction.match(/up|down|left|right/g)) return;

    const pos = this.getNextPosition(direction);

    if (!this.isValidMove(pos.x, pos.y)) {
      return { text: 'You cannot move there.' };
    }

    if (this.map[pos.x][pos.y] === TILES.MOB) {
      return this.doCombat(pos.x, pos.y);
    }
    if (this.map[pos.x][pos.y] === TILES.STAIRS) {
      return this.createLevel(true);
    }

    this.movePlayer(pos);
    this.moveMobs();
    this.drawMatrix();

    if (this.debug) {
      this.dungeon.drawMap();
    }
    return { text: `You move ${direction}.` };
  }

  getNextPosition(direction) {
    const up = direction === 'up';
    const down = direction === 'down';
    const left = direction === 'left';
    const right = direction === 'right';
    const pos = { x: this.player.x, y: this.player.y };

    if (up) pos.x += -1;
    if (down) pos.x += 1;
    if (left) pos.y += -1;
    if (right) pos.y += 1;

    return pos;
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
  }

  moveMobs() {
    this.mobs.forEach(mob => {
      if (!mob.closeToPlayer(this.player)) {
        mob.moveRandom(this.map);
      } else if (mob.nextToPlayer(this.player)) {
        this.doCombat(mob.x, mob.y);
      } else {
        mob.moveToPlayer(this.map, this.player);
      }
    });
  }

  doCombat(x, y) {
    const status = { text: '' };
    const mob = this.mobs.find(mob => mob.x === x && mob.y === y);
    const playerDamage = this.player.attack();
    const mobDamage = mob.attack();

    mob.health = mob.health - playerDamage;

    if (mob.health < 1) {
      this.mobs = this.mobs.filter(mob => mob.health > 1);
      this.map[x][y] = TILES.GROUND;
      status.text = 'You destroyed a mob!';
    } else {
      this.player.health = this.player.health - mobDamage;
      if (this.player.health < 1) {
        this.gameOver = true;
        status.text = 'You were killed by a mob!';
      }
    }

    if (!status.text) {
      const playerText = playerDamage > 0 ? `You attack a mob for ${playerDamage}!` : 'Your attack misses.';
      const mobText = mobDamage > 0 ? `The mob attacks you for ${mobDamage}!` : "You dodge the mob's attack!";
      status.text = `${playerText} ${mobText}`;
      status.player = this.player;
    }

    if (this.debug) this.dungeon.drawMap();
    this.drawMatrix();

    return status;
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
    const mob = this.map[x][y] === TILES.MOB;
    const emptyTile = validTile && !player && !stairs && !mob;

    if (emptyTile) {
      return COLORS.cyan;
    } else if (validTile && player) {
      return COLORS.magenta;
    } else if (validTile && stairs) {
      return COLORS.orange;
    } else if (validTile && mob) {
      return COLORS.red;
    }
    return COLORS.black;
  }

  createLevel(isNextLevel) {
    this.level = this.level + 1;
    this.map = Array(MAP_HEIGHT).fill().map(() => Array(MAP_WIDTH));
    this.dungeon = new Dungeon(this.map).create();
    this.setPlayerLocation();
    this.addMobs();
    this.drawMatrix();
    if (this.debug) {
      this.dungeon.drawMap();
    }
    if (isNextLevel) {
      return { text: `You have reached level ${this.level} of the dungeon` };
    }
  }

  addMobs() {
    this.mobs = [];
    const mobCount = getRandomArbitrary(2, 5);

    for (let i = 0; i <= mobCount; i++) {
      const eligibleRooms = this.dungeon.rooms.filter(room => !room.startingRoom);
      const rng = getRandomArbitrary(0, this.dungeon.rooms.length - 2); // omit starting room
      const room = eligibleRooms[rng];
      let randomX = getRandomArbitrary(room.x1, room.x2);
      let randomY = getRandomArbitrary(room.y1, room.y2);

      // Prevent stacking mobs on one another
      while (this.map[randomX][randomY] === TILES.MOB) {
        randomX = getRandomArbitrary(room.x1, room.x2);
        randomY = getRandomArbitrary(room.y1, room.y2);
      }

      this.map[randomX][randomY] = TILES.MOB;
      this.mobs.push(new Mob(randomX, randomY));
    }
  }

  isValidMove(x, y) {
    return (
      x >= 0 &&
      y >= 0 &&
      x < MAP_HEIGHT &&
      y < MAP_WIDTH &&
      this.map[x][y]
    );
  }
}
