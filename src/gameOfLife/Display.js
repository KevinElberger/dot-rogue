import { LedMatrix } from 'rpi-led-matrix';
import { matrixOptions, runtimeOptions, COLORS, ONE_SECOND, ONE_MINUTE } from '../constants.js';

export default class Display {
  display = new LedMatrix(matrixOptions, runtimeOptions);

  updateCells(map) {
    for (let y = 0; y < this.display.height(); y++) {
      for (let x = 0; x < this.display.width(); x++) {
        this.updateCellColor(map[y][x]);
      }
    }

    this.drawCells(map);
  }

  updateCellColor(cell) {
    if (cell.getState() === 'alive') {
      if (cell.getAliveDuration() === 1) {
        cell.setColor(COLORS.cyan);
      } else {
        cell.setColor(COLORS.blue);
      }
    } else {
      cell.setColor(COLORS.black);
    }
  }

  drawCells(map) {
    const drawGameOfLife = (mat, dt, t) => {
      this.display.map(([x, y, i]) => map[y][x].getColor());
      setTimeout(() => { this.display.sync() }, ONE_MINUTE);
    };

    try {
      this.display.afterSync(drawGameOfLife);
      this.display.sync();
    } catch(error) {
      console.log(error);
    }
  }
}
