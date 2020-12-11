import { MAP_HEIGHT, MAP_WIDTH, TILES } from '../constants.js';
import { getRandomArbitrary } from '../utils.js';
import Room from './Room.js';

export default class Dungeon {
  map;
  rooms = [];
  maxRooms = 2;
  minRoomSize = 4;
  maxRoomSize = 8;

  constructor(map) {
    this.map = map;
  }

  create() {
    while (this.rooms.length < 8) {
      this.createRooms();
    }
    this.rooms[this.rooms.length - 1].exit = true;
    this.drawRooms();
    return this;
  }

  createRooms() {
    for (let r = 0; r < this.maxRooms; r++) {
      const newRoom = this.createRoom();

      let failed = false;

      this.rooms.forEach(room => {
        if (newRoom.intersects(room)) {
          failed = true;
          return;
        }
      });

      if (failed) return;

      if (this.rooms.length) {
        const previousRoom = this.rooms[this.rooms.length - 1];
        this.carveCorridors(previousRoom, newRoom);
      }

      this.rooms.push(newRoom);
    }
  }

  createRoom() {
    const { x, y, w, h } = this.createRoomDimensions();

    let newRoom = new Room(x, y, w, h);

    while (!newRoom.isValid()) {
      const { x, y, w, h } = this.createRoomDimensions();
      newRoom = new Room(x, y, w, h);
    }

    return newRoom;
  }

  createRoomDimensions() {
    const w = getRandomArbitrary(this.minRoomSize, this.maxRoomSize);
    const h = getRandomArbitrary(this.minRoomSize, this.maxRoomSize);
    const x = getRandomArbitrary(0, MAP_HEIGHT - 1);
    const y = getRandomArbitrary(0, MAP_WIDTH - 1);

    return {
      w, h, x, y
    };
  }

  carveCorridors(previousRoom, currentRoom) {
    const minX = Math.min(previousRoom.center[0], currentRoom.center[0]);
    const maxX = Math.max(previousRoom.center[0], currentRoom.center[0]);
    const minY = Math.min(previousRoom.center[1], currentRoom.center[1]);
    const maxY = Math.max(previousRoom.center[1], currentRoom.center[1]);
    const centerY = previousRoom.center[1] > currentRoom.center[1] ? currentRoom.center[1] : previousRoom.center[1];
    const currentRoomIsBottomLeftToPreviousRoom = (
      currentRoom.center[0] > previousRoom.center[0] && currentRoom.center[1] < previousRoom.center[1]
    );
    const currentRoomIsTopRightToPreviousRoom = (
      currentRoom.center[0] < previousRoom.center[0] && currentRoom.center[1] > previousRoom.center[1]
    );
    const currentRoomIsBottomRightToPreviousRoom = (
      currentRoom.center[0] > previousRoom.center[0] && currentRoom.center[1] > previousRoom.center[1]
    );
    let centerX;

    if (currentRoomIsBottomRightToPreviousRoom) {
      centerX = maxX;
    } else if (currentRoomIsTopRightToPreviousRoom || currentRoomIsBottomLeftToPreviousRoom) {
      centerX = minX;
    } else {
      centerX = maxX;
    }

    for (let x = minX; x <= maxX; x++) {
      this.map[x][centerY] = TILES.GROUND;
    }
    for (let y = minY; y <= maxY; y++) {
      this.map[centerX][y] = TILES.GROUND;
    }
  }

  drawRooms() {
    this.rooms.forEach(room => {
      const minX = Math.min(room.x1, room.x2);
      const minY = Math.min(room.y1, room.y2);

      const maxX = Math.max(room.x1, room.x2);
      const maxY = Math.max(room.y1, room.y2);

      for (let x = 0; x < MAP_WIDTH ; x++) {
        for (let y = 0; y < MAP_HEIGHT; y++) {
          const inRoomBounds = (
            x >= minX
            && y >= minY
            && x <= maxX
            && y <= maxY
          );

          if (inRoomBounds) {
            this.map[x][y] = TILES.GROUND;
          }
        }
      }

      if (room.exit) {
        this.map[room.center[0]][room.center[1]] = TILES.STAIRS;
      }
    });
  }

  drawMap() {
    console.table(this.map);
  }
}
