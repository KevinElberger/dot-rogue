export default class Cell {
  x;
  y;
  state;
  color;

  constructor(x, y, state) {
    this.x = x;
    this.y = y;
    this.state = state;
  }

  getX() {
    return this.x;
  }

  getY() {
    return this.y;
  }

  getColor() {
    return this.color;
  }

  setColor(color) {
    this.color = color;
  }

  getState() {
    return this.state;
  }

  setState(state) {
    this.state = state;
  }

  clone() {
    return new Cell(this.x, this.y, this.state);
  }
}
