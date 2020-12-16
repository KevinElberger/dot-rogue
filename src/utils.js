import { MAP_HEIGHT, MAP_WIDTH } from "./constants.js";

export const getRandomArbitrary = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

export const shuffle = (array) => {
  var currentIndex = array.length, temporaryValue, randomIndex;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

export const randomGameOfLife = () => {
  return Array(MAP_HEIGHT).fill(Math.random() > 0.4 ? 1 : 0)
    .map(() => Array(MAP_WIDTH).fill(Math.random() > 0.4 ? 1 : 0));
};

export const wordsToLines = (maxWidth, words) => {
  const lines = [];
  let tmpLine = [];
  let tmpLineWidth = 0;

  words.filter(({ length }) => length > 0).forEach(word => {
    const wordWidth = calcWordWidth(word);
    if (tmpLineWidth + wordWidth > maxWidth) {
      lines.push(tmpLine);
      const firstWord = word.filter(g => !isSeparator(g));
      tmpLine = [ firstWord ];
      tmpLineWidth = calcWordWidth(firstWord);
    }
    else {
      tmpLine.push(word);
      tmpLineWidth += wordWidth;
    }
  });

  if (tmpLine.length > 0) lines.push(tmpLine);

  return lines;
};

export const textToLines = (font, maxW, text) => {
  const fontHeight = font.height();
  const glyphs = text.split('').map(char => ({
    char,
    h: fontHeight,
    w: font.stringWidth(char),
  }));

  return wordsToLines(maxW, glyphsToWords(glyphs));
};

const isSeparator = ({ char }) => char === ' ';

const glyphsToWords = (glyphs) => {
  const index = glyphs
    .map((g, i) => i === 0 && isSeparator(g) ? null : g.char)
    .indexOf(' ');

  return index > 0
    ? [glyphs.slice(0, index), ...glyphsToWords(glyphs.slice(index))]
    : [glyphs];
};

const calcWordWidth = (gs) => gs.reduce((sum, { w }) => sum + w, 0);
const VerticalAlignment = {
  Bottom: 'bottom',
  Middle: 'middle',
  Top: 'top',
};
const HorizontalAlignment = {
  Left: 'left',
  Center: 'center',
  Right: 'right',
};

export const linesToMappedGlyphs = (
  lines,
  lineH,
  containerW,
  containerH,
  alignH = HorizontalAlignment.Center,
  alignV = VerticalAlignment.Middle
) => {
  const blockH = lineH * lines.length;

  const offsetY = (() => {
    switch (alignV) {
      case VerticalAlignment.Top: return 0;
      case VerticalAlignment.Middle: return Math.floor((containerH - blockH) / 2);
      case VerticalAlignment.Bottom: return containerH - blockH;
    }
  })();


  return lines.map((words, i) => {
    const lineGlyphs = words.reduce((glyphs, word) => [...glyphs, ...word], []);
    const lineW = calcWordWidth(lineGlyphs);
    let offsetX = (() => {
      switch (alignH) {
        case HorizontalAlignment.Left: return 0;
        case HorizontalAlignment.Center: return Math.floor((containerW - lineW) / 2);
        case HorizontalAlignment.Right: return containerW - lineW;
      }
    })();

    return lineGlyphs.map(glyph => {
      const mapped = {
        ...glyph,
        x: offsetX,
        y: offsetY + i * lineH,
      };
      offsetX += glyph.w;

      return mapped;
    });
  })
  .reduce((glyphs, words) => [...glyphs, ...words], []);
};
