import Cell from "./Cell.js";
import Display from "./Display.js";

export default class GameOfLife {
  display = new Display();
  interval = null;
  cells = [];
  initialCells = [];

  constructor(initialCells) {
    this.initialCells = initialCells;
  }

  init() {
    for (let y = 0; y < this.display.display.height(); y++) {
      for (let x = 0; x < this.display.display.width(); x++) {
        const state = this.initialCells[y][x] === 1 ? 'alive' : 'dead';
        this.initialCells[y][x] = new Cell(x, y, state);
      }
    }
    this.cells = this.initialCells;
    this.display.updateCells(this.cells);
  }

  nextGenCells() {
    const nextGen = [];
    const currentGen = this.cells;
    const lengthY = this.display.display.height();
    const lengthX = this.display.display.width();

    for (let y = 0; y < lengthY; y++) {
      nextGen[y] = [];
      for (let x = 0; x < lengthX; x++) {
        const cell = currentGen[y][x];
        const rowAbove = (y - 1 >= 0) ? y - 1 : lengthY - 1;
        const rowBelow = (y + 1 <= lengthY - 1) ? y + 1 : 0;
        const colLeft = (x - 1 >= 0) ? x - 1 : lengthX - 1;
        const colRight = (x + 1 <= lengthX - 1) ? x + 1 : 0;
        const neighbors = {
          topLeft: currentGen[rowAbove][colLeft].clone(),
          topCenter: currentGen[rowAbove][x].clone(),
          topRight: currentGen[rowAbove][colRight].clone(),
          left: currentGen[y][colLeft].clone(),
          right: currentGen[y][colRight].clone(),
          bottomLeft: currentGen[rowBelow][colLeft].clone(),
          bottomCenter: currentGen[rowBelow][x].clone(),
          bottomRight: currentGen[rowBelow][colRight].clone()
        };
        let aliveCount = this.setAliveCount(neighbors);

        nextGen[y][x] = this.setNewState(cell, x, y, aliveCount);
      }
    }

    return nextGen;
  }

  setAliveCount(neighbors) {
    let aliveCount = 0;

    for (const neighbor in neighbors) {
      if (neighbors[neighbor].getState() === 'alive') {
        aliveCount++;
      }
    }

    return aliveCount;
  }

  setNewState(cell, x, y, aliveCount) {
    let newState = cell.getState();

    if (cell.getState() === 'alive') {
      if (aliveCount < 2 || aliveCount > 3) {
        newState = 'dead';
        cell.setAliveDuration(0);
      } else if (aliveCount === 2 || aliveCount === 3) {
        newState = 'alive';
        cell.setAliveDuration(cell.getAliveDuration() + 1);
      }
    } else if (aliveCount === 3) {
      newState = 'alive';
      cell.setAliveDuration(1);
    }

    return new Cell(x, y, newState);
  }

  step() {
    this.cells = this.nextGenCells();
    this.display.updateCells(this.cells);
  }

  getCurrentGen() {
    return this.cells;
  }

  setInterval(theInterval) {
    this.interval = theInterval;
  }

  getInterval() {
    return this.interval;
  }
}
