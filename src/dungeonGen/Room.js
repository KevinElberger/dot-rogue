import { MAP_WIDTH } from '../constants.js';

export default class Room {
  x1;
  y1;
  x2;
  y2;
  width;
  height;
  center;
  startingRoom = false;

  constructor(x, y, width, height) {
    this.x1 = x;
    this.x2 = x + width;
    this.y1 = y;
    this.y2 = y + height;
    this.width = width;
    this.height = height;
    this.center = [
      Math.floor((this.x1 + this.x2) / 2),
      Math.floor((this.y1 + this.y2) / 2)
    ];
  }

  intersects(room) {
    return (
      this.x1 <= room.x2
      && this.x2 >= room.x1
      && this.y1 <= room.y2
      && this.y2 >= room.y1
    );
  }

  isValid() {
    return (
      this.x1 < MAP_WIDTH &&
      this.x2 < MAP_WIDTH &&
      this.y1 < MAP_WIDTH &&
      this.y2 < MAP_WIDTH &&
      this.center[0] < MAP_WIDTH && this.center[1] < MAP_WIDTH
    );
  }
}
