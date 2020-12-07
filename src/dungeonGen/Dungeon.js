import { MAP_HEIGHT, MAP_WIDTH, TILES } from '../constants.js';
import { getRandomArbitrary } from '../utils.js';
import Room from './Room.js';

export default class Dungeon {
  map;
  rooms = [];
  maxRooms = 10;
  minRoomSize = 4;
  maxRoomSize = 8;

  constructor(map) {
    this.map = map;
  }

  create() {
    while (this.rooms.length < 8) {
      this.createRooms();
    }
    this.drawRooms();
  }

  createRooms() {
    var newCenter = null;

    for (let r = 0; r < this.maxRooms; r++) {
      const w = getRandomArbitrary(this.minRoomSize, this.maxRoomSize);
      const h = getRandomArbitrary(this.minRoomSize, this.maxRoomSize);
      const x = getRandomArbitrary(0, MAP_WIDTH - 1);
      const y = getRandomArbitrary(0, MAP_HEIGHT - 1);

      const newRoom = new Room(x, y, w, h);

      console.log(newRoom);

      var failed = false;

      this.rooms.forEach(room => {
        if (newRoom.intersects(room)) {
          failed = true;
          return;
        }
      });

      if (failed) return;

      newCenter = newRoom.center;

      if (this.rooms.length) {
        const startVertically = Math.random() > 0.5;
        const lastRoomCenter = this.rooms[this.rooms.length - 1].center;

        if (startVertically) {
          this.carveVerticalCorridor(lastRoomCenter[0], newCenter[0], lastRoomCenter[1]);
          this.carveHorizontalCorridor(lastRoomCenter[1], newCenter[1], lastRoomCenter[0]);
        } else {
          this.carveHorizontalCorridor(lastRoomCenter[1], newCenter[1], lastRoomCenter[0]);
          this.carveVerticalCorridor(lastRoomCenter[0], newCenter[0], lastRoomCenter[1]);
        }
      }

      this.rooms.push(newRoom);
    }
  }

  carveHorizontalCorridor(x1, x2, y) {
    const min = Math.min(x1, x2);
    const max = Math.max(x1, x2);

    for (let x = min; x < max; x++) {
      if (max < MAP_WIDTH - 1 && y < MAP_HEIGHT)
        this.map[x][y] = TILES.GROUND;
    }
  }

  carveVerticalCorridor(y1, y2, x) {
    const min = Math.min(y1, y2);
    const max = Math.max(y1, y2);

    for (let y = min; y < max; y++) {
      if (max < MAP_HEIGHT - 1 && y < MAP_HEIGHT)
        this.map[x][y] = TILES.GROUND;
    }
  }

  drawRooms() {
    this.rooms.forEach(room => {
      const minX = Math.min(room.x1, room.x2);
      const minY = Math.min(room.y1, room.y2);

      const maxX = Math.max(room.x1, room.x2);
      const maxY = Math.max(room.y1, room.y2);

      for (let x = 0; x < MAP_WIDTH - 1; x++) {
        for (let y = 0; y < MAP_HEIGHT - 1; y++) {
          const inRoomBounds = (
            x >= minX
            && y >= minY
            && x < maxX
            && y < maxY
          );

          if (inRoomBounds) {
            this.map[x][y] = TILES.GROUND;
          }
        }
      }
    });
  }

  drawMap() {
    console.table(this.map);
  }
}
