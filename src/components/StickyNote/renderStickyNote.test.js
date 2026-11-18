import {
  FONT_SIZE_LIMITS,
  MAX_ROTATION,
  SHAPES,
  buildExportFileName,
  computeLayout,
  fitText,
  tokenize,
  wrapText,
} from './renderStickyNote';

// Fake monospace metrics: CJK/full-width = 1 unit, everything else = 0.5.
const isWide = (ch) => /[　-鿿＀-￯]/.test(ch);
const measureAt = (size) => (str) => Array.from(str).reduce((sum, ch) => sum + (isWide(ch) ? size : size / 2), 0);
const measure = measureAt(1);

describe('tokenize', () => {
  test('splits Chinese per character and English per word', () => {
    expect(tokenize('你好 hello world')).toEqual(['你', '好', ' ', 'hello', ' ', 'world']);
  });

  test('keeps ASCII punctuation inside words', () => {
    expect(tokenize("don't stop!")).toEqual(["don't", ' ', 'stop!']);
  });

  test('glues closing punctuation to the previous character', () => {
    expect(tokenize('好的，走吧。')).toEqual(['好', '的，', '走', '吧。']);
  });

  test('glues opening punctuation to the next character', () => {
    expect(tokenize('看《书》')).toEqual(['看', '《书》']);
  });
});

describe('wrapText', () => {
  test('keeps manual line breaks', () => {
    expect(wrapText('第一行\n第二行', 10, measure)).toEqual(['第一行', '第二行']);
  });

  test('keeps blank lines between paragraphs but drops trailing ones', () => {
    expect(wrapText('上\n\n下\n\n', 10, measure)).toEqual(['上', '', '下']);
  });

  test('breaks Chinese between characters', () => {
    expect(wrapText('今天也要好好吃饭', 3, measure)).toEqual(['今天也', '要好好', '吃饭']);
  });

  test('breaks English between words, never inside one', () => {
    expect(wrapText('hello brave new world', 3, measure)).toEqual(['hello', 'brave', 'new', 'world']);
  });

  test('handles mixed Chinese and English', () => {
    // widths: 记=1 得=1 space=.5 drink=2.5 water=2.5 哦=1
    expect(wrapText('记得 drink water 哦', 5, measure)).toEqual(['记得 drink', 'water 哦']);
  });

  test('never starts a line with closing punctuation', () => {
    const lines = wrapText('一二三，四五', 3, measure);
    lines.forEach((line) => expect(line.startsWith('，')).toBe(false));
    expect(lines).toEqual(['一二', '三，四', '五']);
  });

  test('splits a single word that is wider than the line', () => {
    expect(wrapText('abcdefghij', 2, measure)).toEqual(['abcd', 'efgh', 'ij']);
  });
});

describe('fitText', () => {
  const box = { width: 60, height: 60 };
  const limits = { min: 4, max: 40, lineHeight: 1 };

  test('uses the largest size that fits', () => {
    const result = fitText('一二', box, measureAt, limits);
    expect(result.overflow).toBe(false);
    expect(result.size).toBeGreaterThan(29);
    expect(result.size).toBeLessThanOrEqual(30.01);
  });

  test('never exceeds the maximum size', () => {
    const result = fitText('一', box, measureAt, limits);
    expect(result.size).toBe(40);
  });

  test('prefers keeping manual lines intact when it costs little size', () => {
    // At max size "一二三四" would wrap as "一二三 / 四"; slightly smaller keeps it whole.
    const result = fitText('一二\n一二三四', { width: 60, height: 60 }, measureAt, limits);
    expect(result.lines).toEqual(['一二', '一二三四']);
    expect(result.size).toBeGreaterThan(14.7);
    expect(result.size).toBeLessThanOrEqual(15);
  });

  test('still wraps when keeping lines would shrink the text too much', () => {
    const result = fitText('一二三四五六七八九十', { width: 60, height: 60 }, measureAt, limits);
    expect(result.lines.length).toBeGreaterThan(1);
  });

  test('reports overflow when even the minimum size does not fit', () => {
    const result = fitText('一'.repeat(500), box, measureAt, limits);
    expect(result.size).toBe(4);
    expect(result.overflow).toBe(true);
  });
});

describe('computeLayout', () => {
  test.each(Object.keys(SHAPES))('%s: long edge matches the export size', (shape) => {
    [512, 768, 1024].forEach((size) => {
      const layout = computeLayout({ shape, size });
      expect(Math.max(layout.canvasWidth, layout.canvasHeight)).toBe(size);
    });
  });

  test('multiplies by the pixel ratio for sharp previews', () => {
    expect(computeLayout({ shape: 'square', size: 400, pixelRatio: 2 }).canvasWidth).toBe(800);
  });

  test.each(Object.keys(SHAPES))('%s: rotated paper always fits with margin', (shape) => {
    const { paperWidth: w, paperHeight: h, unitsWidth, unitsHeight } = computeLayout({ shape });
    const t = (MAX_ROTATION * Math.PI) / 180;
    expect(w * Math.cos(t) + h * Math.sin(t)).toBeLessThan(unitsWidth - 20);
    expect(w * Math.sin(t) + h * Math.cos(t)).toBeLessThan(unitsHeight - 20);
  });
});

describe('buildExportFileName', () => {
  test('uses an ASCII timestamp by default', () => {
    expect(buildExportFileName(new Date(2026, 10, 17, 21, 59))).toBe('sticky-note-20261117-2159.png');
  });

  test('uses a sanitised custom name when given', () => {
    expect(buildExportFileName(new Date(), 'My Note.png')).toBe('my-note.png');
    expect(buildExportFileName(new Date(), 'hair_note-1')).toBe('hair_note-1.png');
  });

  test('falls back to the timestamp when the custom name has no usable characters', () => {
    expect(buildExportFileName(new Date(2026, 0, 2, 3, 4), '便利贴')).toBe('sticky-note-20260102-0304.png');
  });
});

test('font size limits are sane', () => {
  expect(FONT_SIZE_LIMITS.min).toBeLessThan(FONT_SIZE_LIMITS.max);
});
