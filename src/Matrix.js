import * as globby from 'globby';
import { basename } from 'path';
import { Font, LedMatrix } from 'rpi-led-matrix';
import { linesToMappedGlyphs, textToLines } from './utils.js';
import { matrixOptions, runtimeOptions, COLORS, ONE_SECOND } from './constants.js';

export default class Matrix {
  width = 32;
  height = 32;
  stop = false;
  matrixTimeout = null;
  matrix = new LedMatrix(matrixOptions, runtimeOptions);

  async meeting() {
    const font = await this.loadFont();
    this.matrix.fgColor(this.matrix.bgColor()).fill().fgColor(COLORS.magenta);
    const lines = textToLines(font, this.width, 'In a mtg');
    const alignmentH = 'center';
    const alignmentV = 'middle';

    (async () => {
      try {
        this.matrix.clear();
        this.matrix.afterSync((mat, dt, t) => {
          console.log(this.canDraw());
          if (!this.canDraw()) return;
          linesToMappedGlyphs(lines, font.height(), this.width, this.height, alignmentH, alignmentV).map(glyph => {
            this.matrix.drawText(glyph.char, glyph.x, glyph.y);
          });
          this.matrixTimeout = setTimeout(() => {
            console.log(this);
            console.log(this.canDraw());
            if (this.canDraw()) {
              this.matrix.sync();
            }
          }, ONE_SECOND);
        });
        this.matrix.sync();
      } catch(error) {
        console.log(error);
      }
    })();
  }

  canDraw() {
    return !this.stop;
  }

  stopMatrix() {
    this.stop = true;
    if (this.matrixTimeout) clearTimeout(this.matrixTimeout);
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
          this.matrixTimeout = setTimeout(() => this.matrix.sync(), ONE_SECOND);
        });
        this.matrix.sync();
      } catch(error) {
        console.log(error);
      }
    })();
  }
}
