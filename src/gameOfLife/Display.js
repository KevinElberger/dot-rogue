import { LedMatrix } from 'rpi-led-matrix';
import { matrixOptions, runtimeOptions, COLORS, ONE_SECOND } from './constants.js';

export default class Display {
  display = new LedMatrix(matrixOptions, runtimeOptions);

  updateCells(map) {
    for (let y = 0; y < this.display.height(); y++) {
      for (let x = 0; x < this.display.width(); x++) {
        this.drawCell(map[y][x]);
      }
    }
  }

  drawCell(cell) {

  }
}
