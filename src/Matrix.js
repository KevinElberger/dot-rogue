import { Font, LedMatrix } from 'rpi-led-matrix';
import { linesToMappedGlyphs, textToLines } from './utils.js';
import { ONE_MINUTE, matrixOptions, runtimeOptions } from './constants.js';

export default class Matrix {
  timeout = null;
  width = 32;
  height = 32;
  matrix = new LedMatrix(matrixOptions, runtimeOptions);

  constructor() {
    this.loadFont();
  }

  meeting() {
    let render = () => {
      this.matrix.clear();
      const fgColor = this.matrix.fgColor();
      this.matrix.fgColor(this.matrix.bgColor()).fill().fgColor(fgColor);
      const font = fonts[this.matrix.font()];
      const lines = textToLines(font, this.width, 'Hello, matrix!');
      const alignmentH = 'center';
      const alignmentV = 'middle';

      linesToMappedGlyphs(lines, font.height(), this.width, this.height, alignmentH, alignmentV).map(glyph => {
        matrix.drawText(glyph.char, glyph.x, glyph.y);
      });
      matrix.sync();
    };

    render();
  }

  pulse() {
    const pulsers = [];

    for (let x = 0; x < matrix.width(); x++) {
      for (let y = 0; y < matrix.height(); y++) {
        pulsers.push(new Pulser(x, y, 5 * Math.random()));
      }
    }

    this.draw(() => {
      pulsers.map(pulser => {
        matrix.fgColor(pulser.nextColor(t)).setPixel(pulser.x, pulser.y);
      });
    });
  }

  loadFont() {
    const font = new Font('5x8.bdf', '../fonts/');
    this.matrix.font(font);
  }

  draw(callback) {
    if (this.matrixTimeout) {
      clearTimeout(this.matrixTimeout);
    }

    (async () => {
      try {
        this.matrix.clear();
        this.matrix.afterSync((mat, dt, t) => {
          callback();
          this.matrixTimeout = setTimeout(() => this.matrix.sync(), ONE_MINUTE);
        });
        this.matrix.sync();
      } catch(error) {
        console.log(error);
      }
    })();
  }
}
