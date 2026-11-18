/**
 * Unit definitions and conversion logic for the 换算 app.
 *
 * Linear units carry `factor` = how many base units one of this unit is.
 * Non-linear units (temperature, fuel economy) carry toBase/fromBase.
 * All "US customary" volumes follow the US definitions (1 US gal = 3.785411784 L).
 *
 * Every factor here is an exact legal definition unless noted as approximate.
 */

const INCH = 0.0254; // m, exact
const FOOT = 0.3048; // m, exact
const POUND = 0.45359237; // kg, exact
const US_GALLON = 3.785411784; // L, exact
const US_CUP = (US_GALLON * 1000) / 16; // 236.5882365 mL

export const CATEGORIES = [
  {
    id: 'length',
    label: '长度',
    base: 'm',
    defaultUnit: 'cm',
    units: [
      { id: 'mm', name: '毫米', abbr: 'mm', factor: 0.001 },
      { id: 'cm', name: '厘米', abbr: 'cm', factor: 0.01 },
      { id: 'm', name: '米', abbr: 'm', factor: 1 },
      { id: 'km', name: '千米', abbr: 'km', factor: 1000 },
      { id: 'in', name: '英寸', abbr: 'in', factor: INCH },
      { id: 'ft', name: '英尺', abbr: 'ft', factor: FOOT, compound: 'ftin' },
      { id: 'yd', name: '码', abbr: 'yd', factor: 0.9144 },
      { id: 'mi', name: '英里', abbr: 'mi', factor: 1609.344 },
      { id: 'nmi', name: '海里', abbr: 'nmi', factor: 1852 },
      { id: 'cun', name: '寸', abbr: '市寸', factor: 1 / 30 },
      { id: 'chi', name: '尺', abbr: '市尺', factor: 1 / 3 },
      { id: 'zhang', name: '丈', abbr: '市丈', factor: 10 / 3 },
      { id: 'li', name: '里', abbr: '市里', factor: 500 },
    ],
  },
  {
    id: 'area',
    label: '面积',
    base: 'm2',
    defaultUnit: 'm2',
    units: [
      { id: 'cm2', name: '平方厘米', abbr: 'cm²', factor: 1e-4 },
      { id: 'm2', name: '平方米', abbr: 'm²', factor: 1 },
      { id: 'ha', name: '公顷', abbr: 'ha', factor: 10000 },
      { id: 'km2', name: '平方千米', abbr: 'km²', factor: 1e6 },
      { id: 'mu', name: '亩', abbr: '市亩', factor: 10000 / 15 },
      { id: 'ping', name: '坪', abbr: '坪', factor: 400 / 121 },
      { id: 'in2', name: '平方英寸', abbr: 'in²', factor: INCH * INCH },
      { id: 'ft2', name: '平方英尺', abbr: 'ft²', factor: FOOT * FOOT },
      { id: 'yd2', name: '平方码', abbr: 'yd²', factor: 0.9144 * 0.9144 },
      { id: 'acre', name: '英亩', abbr: 'acre', factor: 4046.8564224 },
      { id: 'mi2', name: '平方英里', abbr: 'mi²', factor: 1609.344 * 1609.344 },
    ],
  },
  {
    id: 'weight',
    label: '重量',
    base: 'kg',
    defaultUnit: 'kg',
    units: [
      { id: 'mg', name: '毫克', abbr: 'mg', factor: 1e-6 },
      { id: 'g', name: '克', abbr: 'g', factor: 0.001 },
      { id: 'kg', name: '千克', abbr: 'kg · 公斤', factor: 1 },
      { id: 't', name: '吨', abbr: 't', factor: 1000 },
      { id: 'liang', name: '两', abbr: '市两', factor: 0.05 },
      { id: 'jin', name: '斤', abbr: '市斤', factor: 0.5, compound: 'jinliang' },
      { id: 'oz', name: '盎司', abbr: 'oz', factor: POUND / 16 },
      { id: 'lb', name: '磅', abbr: 'lb', factor: POUND, compound: 'lboz' },
      { id: 'st', name: '英石', abbr: 'st', factor: POUND * 14 },
      { id: 'ct', name: '克拉', abbr: 'ct', factor: 0.0002 },
    ],
  },
  {
    id: 'temperature',
    label: '温度',
    base: 'c',
    defaultUnit: 'c',
    units: [
      { id: 'c', name: '摄氏度', abbr: '°C', toBase: (v) => v, fromBase: (v) => v },
      { id: 'f', name: '华氏度', abbr: '°F', toBase: (v) => ((v - 32) * 5) / 9, fromBase: (v) => (v * 9) / 5 + 32 },
      { id: 'k', name: '开尔文', abbr: 'K', toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
    ],
  },
  {
    id: 'volume',
    label: '容量',
    base: 'ml',
    defaultUnit: 'ml',
    units: [
      { id: 'ml', name: '毫升', abbr: 'mL', factor: 1 },
      { id: 'l', name: '升', abbr: 'L', factor: 1000 },
      { id: 'm3', name: '立方米', abbr: 'm³', factor: 1e6 },
      { id: 'tsp', name: '茶匙', abbr: 'tsp', factor: US_CUP / 48 },
      { id: 'tbsp', name: '汤匙', abbr: 'tbsp', factor: US_CUP / 16 },
      { id: 'floz', name: '液量盎司', abbr: 'fl oz', factor: US_CUP / 8 },
      { id: 'cup', name: '杯', abbr: 'cup', factor: US_CUP },
      { id: 'pt', name: '品脱', abbr: 'pt', factor: US_CUP * 2 },
      { id: 'qt', name: '夸脱', abbr: 'qt', factor: US_CUP * 4 },
      { id: 'gal', name: '加仑', abbr: 'gal', factor: US_GALLON * 1000 },
    ],
  },
  {
    id: 'speed',
    label: '速度',
    base: 'ms',
    defaultUnit: 'kmh',
    units: [
      { id: 'kmh', name: '千米/时', abbr: 'km/h', factor: 1000 / 3600 },
      { id: 'ms', name: '米/秒', abbr: 'm/s', factor: 1 },
      { id: 'mph', name: '英里/时', abbr: 'mph', factor: 1609.344 / 3600 },
      { id: 'kn', name: '节', abbr: 'kn', factor: 1852 / 3600 },
      { id: 'fts', name: '英尺/秒', abbr: 'ft/s', factor: FOOT },
    ],
  },
  {
    id: 'fuel',
    label: '油耗',
    base: 'kml',
    defaultUnit: 'l100',
    units: [
      { id: 'l100', name: '升/百公里', abbr: 'L/100km', toBase: (v) => 100 / v, fromBase: (v) => 100 / v },
      { id: 'mpg', name: '英里/加仑', abbr: 'mpg (US)', toBase: (v) => (v * 1.609344) / US_GALLON, fromBase: (v) => (v * US_GALLON) / 1.609344 },
      { id: 'kml', name: '千米/升', abbr: 'km/L', toBase: (v) => v, fromBase: (v) => v },
    ],
  },
  {
    id: 'pressure',
    label: '胎压',
    base: 'kpa',
    defaultUnit: 'psi',
    units: [
      { id: 'psi', name: '磅/平方英寸', abbr: 'psi', factor: 6.894757293168 },
      { id: 'kpa', name: '千帕', abbr: 'kPa', factor: 1 },
      { id: 'bar', name: '巴', abbr: 'bar', factor: 100 },
      { id: 'kgfcm2', name: '公斤力/平方厘米', abbr: 'kgf/cm²', factor: 98.0665 },
      { id: 'atm', name: '标准大气压', abbr: 'atm', factor: 101.325 },
    ],
  },
  {
    id: 'energy',
    label: '能量',
    base: 'kj',
    defaultUnit: 'kcal',
    units: [
      { id: 'kcal', name: '千卡', abbr: 'kcal · 大卡', factor: 4.184 },
      { id: 'kj', name: '千焦', abbr: 'kJ', factor: 1 },
      { id: 'cal', name: '卡', abbr: 'cal', factor: 0.004184 },
      { id: 'j', name: '焦耳', abbr: 'J', factor: 0.001 },
      { id: 'kwh', name: '千瓦时', abbr: 'kWh · 度', factor: 3600 },
    ],
  },
  {
    id: 'cooking',
    label: '烹饪',
    kind: 'cooking',
    base: 'g',
    defaultUnit: 'cup',
    units: [
      { id: 'cup', name: '杯', abbr: 'cup', volume: US_CUP },
      { id: 'tbsp', name: '汤匙', abbr: 'tbsp', volume: US_CUP / 16 },
      { id: 'tsp', name: '茶匙', abbr: 'tsp', volume: US_CUP / 48 },
      { id: 'ml', name: '毫升', abbr: 'mL', volume: 1 },
      { id: 'g', name: '克', abbr: 'g', mass: 1 },
      { id: 'oz', name: '盎司', abbr: 'oz', mass: (POUND * 1000) / 16 },
      { id: 'lb', name: '磅', abbr: 'lb', mass: POUND * 1000 },
    ],
  },
  { id: 'currency', label: '汇率', kind: 'currency', base: 'USD', defaultUnit: 'CAD', units: [] },
  { id: 'shoes', label: '鞋码', kind: 'table', defaultUnit: 'eu', defaultInput: '42' },
  { id: 'clothes', label: '衣服', kind: 'table', defaultUnit: 'chest', defaultInput: '96' },
];

/** Grams per US cup (approximate; from common baking references). */
export const INGREDIENTS = [
  { id: 'water', name: '水', gramsPerCup: 236.6 },
  { id: 'milk', name: '牛奶', gramsPerCup: 242 },
  { id: 'flour', name: '中筋面粉', gramsPerCup: 120 },
  { id: 'sugar', name: '白砂糖', gramsPerCup: 198 },
  { id: 'brown-sugar', name: '红糖（压实）', gramsPerCup: 213 },
  { id: 'powdered-sugar', name: '糖粉', gramsPerCup: 113 },
  { id: 'butter', name: '黄油', gramsPerCup: 227 },
  { id: 'oil', name: '食用油', gramsPerCup: 218 },
  { id: 'rice', name: '大米（生）', gramsPerCup: 190 },
  { id: 'oats', name: '燕麦片', gramsPerCup: 89 },
  { id: 'honey', name: '蜂蜜', gramsPerCup: 336 },
  { id: 'cocoa', name: '可可粉', gramsPerCup: 84 },
  { id: 'salt', name: '细盐', gramsPerCup: 288 },
];

export const CURRENCIES = [
  { id: 'CAD', name: '加元', abbr: 'CAD' },
  { id: 'CNY', name: '人民币', abbr: 'CNY' },
  { id: 'USD', name: '美元', abbr: 'USD' },
  { id: 'HKD', name: '港币', abbr: 'HKD' },
  { id: 'EUR', name: '欧元', abbr: 'EUR' },
  { id: 'GBP', name: '英镑', abbr: 'GBP' },
  { id: 'JPY', name: '日元', abbr: 'JPY' },
  { id: 'KRW', name: '韩元', abbr: 'KRW' },
  { id: 'AUD', name: '澳元', abbr: 'AUD' },
];

export const getCategory = (id) => CATEGORIES.find((category) => category.id === id) || CATEGORIES[0];

/* ------------------------------------------------------------------ */
/* Conversion                                                          */
/* ------------------------------------------------------------------ */

const toBase = (unit, value) => (unit.toBase ? unit.toBase(value) : value * unit.factor);
const fromBase = (unit, value) => (unit.fromBase ? unit.fromBase(value) : value / unit.factor);

/** Convert between two units of the same linear/function category. */
export function convert(value, fromUnit, toUnit) {
  if (!Number.isFinite(value)) return NaN;
  if (fromUnit === toUnit) return value;
  return fromBase(toUnit, toBase(fromUnit, value));
}

/** Cooking: any of cup/tbsp/tsp/mL/g/oz/lb, through grams, using the ingredient density. */
export function convertCooking(value, fromUnit, toUnit, ingredient) {
  if (!Number.isFinite(value)) return NaN;
  const gramsPerMl = ingredient.gramsPerCup / US_CUP;
  const grams = fromUnit.mass ? value * fromUnit.mass : value * fromUnit.volume * gramsPerMl;
  return toUnit.mass ? grams / toUnit.mass : grams / gramsPerMl / toUnit.volume;
}

/** Currency: rates are "units of X per 1 base currency". */
export function convertCurrency(value, from, to, rates) {
  if (!Number.isFinite(value) || !rates?.[from] || !rates?.[to]) return NaN;
  return (value / rates[from]) * rates[to];
}

/* ------------------------------------------------------------------ */
/* Input parsing (no eval)                                             */
/* ------------------------------------------------------------------ */

export const COMPOUND = {
  ftin: { major: '′', minor: '″', perMajor: 12, majorLabel: '英尺', minorLabel: '英寸' },
  jinliang: { major: '斤', minor: '两', perMajor: 10, majorLabel: '斤', minorLabel: '两' },
  lboz: { major: 'lb', minor: 'oz', perMajor: 16, majorLabel: '磅', minorLabel: '盎司' },
};

/**
 * Evaluate what the user typed on the keypad.
 * Supports + − × ÷, unary minus, decimals, and compound values such as
 * 5′11″ (feet+inches), 1斤2两, 3lb4oz — the compound marker depends on the unit.
 * Returns a number, or NaN for incomplete/invalid input.
 */
export function evaluateInput(input, compoundId) {
  const text = String(input ?? '').replace(/\s+/g, '');
  if (!text) return NaN;
  const compound = compoundId ? COMPOUND[compoundId] : null;

  // Tokenise
  const tokens = [];
  let i = 0;
  while (i < text.length) {
    const rest = text.slice(i);
    const num = /^(\d+\.?\d*|\.\d+)/.exec(rest);
    if (num) {
      tokens.push({ type: 'num', value: Number(num[1]) });
      i += num[1].length;
      continue;
    }
    if (compound && rest.startsWith(compound.major)) {
      tokens.push({ type: 'major' });
      i += compound.major.length;
      continue;
    }
    if (compound && rest.startsWith(compound.minor)) {
      tokens.push({ type: 'minor' });
      i += compound.minor.length;
      continue;
    }
    const op = { '+': '+', '-': '-', '−': '-', '×': '*', '*': '*', '÷': '/', '/': '/' }[text[i]];
    if (op) {
      tokens.push({ type: 'op', value: op });
      i += 1;
      continue;
    }
    return NaN;
  }

  // Recursive descent: expr := term (('+'|'-') term)* ; term := factor (('*'|'/') factor)*
  let pos = 0;
  const peek = () => tokens[pos];
  const parseOperand = () => {
    const token = peek();
    if (!token) return NaN;
    if (token.type === 'op' && token.value === '-') {
      pos += 1;
      return -parseOperand();
    }
    if (token.type !== 'num') return NaN;
    pos += 1;
    let value = token.value;
    if (compound && peek()?.type === 'major') {
      pos += 1;
      if (peek()?.type === 'num') {
        const minor = peek().value;
        pos += 1;
        if (peek()?.type === 'minor') pos += 1;
        value += minor / compound.perMajor;
      }
    } else if (compound && peek()?.type === 'minor') {
      pos += 1;
      value /= compound.perMajor;
    }
    return value;
  };
  const parseTerm = () => {
    let value = parseOperand();
    while (peek()?.type === 'op' && (peek().value === '*' || peek().value === '/')) {
      const op = peek().value;
      pos += 1;
      const rhs = parseOperand();
      value = op === '*' ? value * rhs : value / rhs;
    }
    return value;
  };
  const parseExpr = () => {
    let value = parseTerm();
    while (peek()?.type === 'op' && (peek().value === '+' || peek().value === '-')) {
      const op = peek().value;
      pos += 1;
      const rhs = parseTerm();
      value = op === '+' ? value + rhs : value - rhs;
    }
    return value;
  };

  const result = parseExpr();
  if (pos !== tokens.length || !Number.isFinite(result)) return NaN;
  return result;
}

/** True if the input is more than a plain number (shows "= result" under it). */
export const isExpression = (input) => /[+×÷*/]|.-|[′″斤两]|lb|oz/.test(String(input ?? ''));

/* ------------------------------------------------------------------ */
/* Formatting                                                          */
/* ------------------------------------------------------------------ */

const SUPERSCRIPT = { '-': '⁻', 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };

/** Up to 7 significant digits, grouped, no trailing zeros; scientific for extremes. */
export function formatNumber(value, { digits = 7 } = {}) {
  if (!Number.isFinite(value)) return '—';
  if (value === 0) return '0';
  const abs = Math.abs(value);
  if (abs >= 1e12 || abs < 1e-6) {
    const [mantissa, exponent] = value.toExponential(3).split('e');
    const m = String(Number(mantissa));
    const e = String(Number(exponent)).replace(/./g, (ch) => SUPERSCRIPT[ch] ?? ch);
    return `${m}×10${e}`;
  }
  const rounded = Number(value.toPrecision(digits));
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 10, useGrouping: true }).format(rounded);
}

/** Plain string for the clipboard: no grouping commas. */
export function plainNumber(value, { digits = 7 } = {}) {
  if (!Number.isFinite(value)) return '';
  return String(Number(value.toPrecision(digits)));
}

/** e.g. 5.75 ft → "5′ 9″", 1.2 斤 → "1斤2两", 3.25 lb → "3 lb 4 oz". */
export function formatCompound(value, compoundId) {
  const compound = COMPOUND[compoundId];
  if (!compound || !Number.isFinite(value) || value < 0) return '';
  let major = Math.floor(value);
  let minor = Number(((value - major) * compound.perMajor).toFixed(1));
  if (minor >= compound.perMajor) {
    major += 1;
    minor = 0;
  }
  const minorText = Number.isInteger(minor) ? String(minor) : minor.toFixed(1);
  if (compoundId === 'ftin') return `${major}′ ${minorText}″`;
  if (compoundId === 'jinliang') return `${major}斤${minorText}两`;
  return `${major} lb ${minorText} oz`;
}

/* ------------------------------------------------------------------ */
/* Size charts (approximate; brands differ)                            */
/* ------------------------------------------------------------------ */

export const SIZE_TABLES = {
  shoes: {
    note: '按脚长对照，不同品牌会有差异，买前最好再看品牌自己的尺码表。',
    numericColumns: ['cm', 'cn', 'eu', 'us', 'uk'],
    columns: [
      { id: 'cm', name: '脚长', abbr: 'cm' },
      { id: 'cn', name: '中国码', abbr: 'mm' },
      { id: 'eu', name: '欧码', abbr: 'EU · 国内常用' },
      { id: 'us', name: '美码', abbr: 'US' },
      { id: 'uk', name: '英码', abbr: 'UK' },
    ],
    groups: {
      men: {
        label: '男鞋',
        rows: [
          [24, 240, 38.5, 6, 5.5],
          [24.5, 245, 39, 6.5, 6],
          [25, 250, 40, 7, 6],
          [25.5, 255, 40.5, 7.5, 6.5],
          [26, 260, 41, 8, 7],
          [26.5, 265, 42, 8.5, 7.5],
          [27, 270, 42.5, 9, 8],
          [27.5, 275, 43, 9.5, 8.5],
          [28, 280, 44, 10, 9],
          [28.5, 285, 44.5, 10.5, 9.5],
          [29, 290, 45, 11, 10],
          [29.5, 295, 45.5, 11.5, 10.5],
          [30, 300, 46, 12, 11],
          [31, 310, 47.5, 13, 12],
        ],
      },
      women: {
        label: '女鞋',
        rows: [
          [22, 220, 35.5, 5, 2.5],
          [22.5, 225, 36, 5.5, 3],
          [23, 230, 36.5, 6, 3.5],
          [23.5, 235, 37.5, 6.5, 4],
          [24, 240, 38, 7, 4.5],
          [24.5, 245, 38.5, 7.5, 5],
          [25, 250, 39, 8, 5.5],
          [25.5, 255, 40, 8.5, 6],
          [26, 260, 40.5, 9, 6.5],
          [26.5, 265, 41, 9.5, 7],
          [27, 270, 42, 10, 7.5],
        ],
      },
    },
  },
  clothes: {
    note: '上衣对照，按胸围估算；版型不同会有差异。',
    numericColumns: ['us', 'eu', 'chest'],
    columns: [
      { id: 'intl', name: '国际', abbr: 'S/M/L' },
      { id: 'cn', name: '中国', abbr: '身高/胸围' },
      { id: 'us', name: '美码', abbr: 'US · CA' },
      { id: 'eu', name: '欧码', abbr: 'EU' },
      { id: 'chest', name: '胸围', abbr: 'cm' },
    ],
    groups: {
      men: {
        label: '男装',
        rows: [
          ['S', '165/88A', '34–36', 46, '86–90'],
          ['M', '170/92A', '38–40', 48, '90–94'],
          ['L', '175/96A', '42–44', 50, '94–98'],
          ['XL', '180/100A', '46–48', 52, '98–102'],
          ['XXL', '185/104A', '50–52', 54, '102–106'],
          ['3XL', '190/108A', '54–56', 56, '106–110'],
        ],
      },
      women: {
        label: '女装',
        rows: [
          ['XS', '155/80A', '0–2', 34, '78–82'],
          ['S', '160/84A', '4–6', 36, '82–86'],
          ['M', '165/88A', '8–10', 38, '86–90'],
          ['L', '170/92A', '12–14', 40, '90–94'],
          ['XL', '175/96A', '16–18', 42, '94–98'],
          ['XXL', '180/100A', '20', 44, '98–102'],
        ],
      },
    },
  },
};

const cellNumber = (cell) => {
  if (typeof cell === 'number') return cell;
  const range = /^(\d+(?:\.\d+)?)\s*[–-]\s*(\d+(?:\.\d+)?)$/.exec(String(cell));
  if (range) return (Number(range[1]) + Number(range[2])) / 2;
  return Number(cell);
};

/** Index of the row whose value in column `col` is closest to `value`. Ranges like "86–90" count as their midpoint. */
export function nearestSizeRow(rows, col, value) {
  let best = -1;
  let bestDiff = Infinity;
  rows.forEach((row, index) => {
    const cell = cellNumber(row[col]);
    if (!Number.isFinite(cell)) return;
    const diff = Math.abs(cell - value);
    if (diff < bestDiff) {
      best = index;
      bestDiff = diff;
    }
  });
  return best;
}
