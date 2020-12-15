import * as globby from 'globby';
import { basename } from 'path';
import { Font, LedMatrix } from 'rpi-led-matrix';
import { linesToMappedGlyphs, textToLines } from './utils.js';
import { matrixOptions, runtimeOptions, COLORS, ONE_SECOND } from './constants.js';

export default class Matrix {
  width = 32;
  height = 32;
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
          linesToMappedGlyphs(lines, font.height(), this.width, this.height, alignmentH, alignmentV).map(glyph => {
            this.matrix.drawText(glyph.char, glyph.x, glyph.y);
          });
          setTimeout(() => { this.matrix.sync() }, ONE_SECOND);
        });
        this.matrix.sync();
      } catch(error) {
        console.log(error);
      }
    })();
  }

  stopMatrix() {
    this.matrix.clear().sync();
  }

  pulse() {
    const pulsers = [];

    for (let x = 0; x < matrix.width(); x++) {
      for (let y = 0; y < matrix.height(); y++) {
        pulsers.push(new Pulser(x, y, 5 * Math.random()));
      }
    }

    try {
      this.matrix.clear();
      this.matrix.afterSync((mat, dt, t) => {
        pulsers.map(pulser => {
          matrix.fgColor(pulser.nextColor(t)).setPixel(pulser.x, pulser.y);
        });
        setTimeout(() => { this.matrix.sync() }, ONE_SECOND);
      });
      this.matrix.sync();
    } catch(error) {
      console.log(error);
    }
  }

  async clock() {
    const font = await this.loadFont();
    this.matrix.fgColor(this.matrix.bgColor()).fill().fgColor(COLORS.blue);
    const alignmentH = 'center';
    const alignmentV = 'top';

    try {
      this.matrix.clear();
      this.matrix.afterSync((mat, dt, t) => {
        const time = this.getTime();
        const lines = textToLines(font, this.width, time);
        linesToMappedGlyphs(lines, font.height(), this.width, this.height, alignmentH, alignmentV).map(glyph => {
          this.matrix.drawText(glyph.char, glyph.x, glyph.y);
        });
        setTimeout(() => { this.matrix.sync() }, ONE_SECOND);
      });
      this.matrix.sync();
    } catch(error) {
      console.log(error);
    }
  }

  getTime() {
    let time;
    const date = new Date();
    const minutes = date.getMinutes();
    const hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
    const hourMap = {
      1: 'one',
      2: 'two',
      3: 'three',
      4: 'four',
      5: 'five',
      6: 'six',
      7: 'seven',
      8: 'eight',
      9: 'nine',
      10: 'ten',
      11: 'eleven',
      12: 'twelve'
    };
    const minutesSpelled = ["o' clock", 'qtr past', 'thirty', 'qtr til'];

    if (minutes < 15) {
      time = `${hourMap[hours]} ${minutesSpelled[0]}`;
    } else if (minutes >= 15 || minutes < 30) {
      time = `${minutesSpelled[1]} ${hourMap[hours]}`;
    } else if (minutes >= 30 || minutes < 45) {
      time = `${hourMap[hours]} ${minutesSpelled[2]}`;
    } else if (minutes >= 45) {
      time = `${minutesSpelled[3]} ${hourMap[hours]}`;
    }

    return time;
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
}
