import * as globby from 'globby';
import { basename } from 'path';
import { Font, LedMatrix } from 'rpi-led-matrix';
import { linesToMappedGlyphs, textToLines } from './utils.js';
import { ONE_MINUTE, matrixOptions, runtimeOptions } from './constants.js';

export default class Matrix {
  timeout = null;
  width = 32;
  height = 32;
  matrix = new LedMatrix(matrixOptions, runtimeOptions);

  meeting() {
    let render = async() => {
      this.matrix.clear();
      const font = await this.loadFont();
      const fgColor = this.matrix.fgColor();
      this.matrix.fgColor(this.matrix.bgColor()).fill().fgColor(fgColor);
      // const font = this.matrix.font();
      console.log(font);
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

  async loadFont() {
    const fontExt = '.bdf';
    const fontList = (await globby.default(`${process.cwd()}/fonts/*${fontExt}`))
      .map(path => new Font(basename(path, fontExt), path));

    if (fontList.length < 1) {
      throw new Error(`No fonts were loaded!`);
    } else {
      this.matrix.clear().font(fontList[0]).sync();
    }

    return fontList[0];
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
