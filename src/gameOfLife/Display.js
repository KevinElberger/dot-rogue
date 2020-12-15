import { LedMatrix } from 'rpi-led-matrix';
import { matrixOptions, runtimeOptions, COLORS, ONE_SECOND } from './constants.js';

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
      cell.setColor(COLORS.cyan);
    } else {
      cell.setColor(COLORS.black);
    }
  }

  drawCells(map) {
    const drawGameOfLife = (mat, dt, t) => {
      this.matrix.clear();
      map.map(([x, y, i]) => {
        if (map[x][y].getState() === 'alive') {
          return COLORS.blue;
        }
        return COLORS.black;
      });

      setTimeout(() => { this.matrix.sync() }, ONE_SECOND);
    };

    try {
      this.display.clear();
      this.display.afterSync(drawGameOfLife);
      this.display.sync();
    } catch(error) {
      console.log(error);
    }
  }
}
