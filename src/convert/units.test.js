import {
  CATEGORIES,
  INGREDIENTS,
  SIZE_TABLES,
  convert,
  convertCooking,
  convertCurrency,
  evaluateInput,
  formatCompound,
  formatNumber,
  getCategory,
  isExpression,
  nearestSizeRow,
  plainNumber,
} from './units';

const unit = (categoryId, unitId) => getCategory(categoryId).units.find((u) => u.id === unitId);
const conv = (categoryId, value, from, to) => convert(value, unit(categoryId, from), unit(categoryId, to));

describe('linear conversions match reference values', () => {
  test.each([
    ['length', 1, 'in', 'cm', 2.54],
    ['length', 1, 'ft', 'm', 0.3048],
    ['length', 1, 'mi', 'km', 1.609344],
    ['length', 1, 'chi', 'cm', 33.3333333],
    ['length', 1, 'cun', 'cm', 3.3333333],
    ['length', 1, 'li', 'm', 500],
    ['length', 1, 'nmi', 'm', 1852],
    ['area', 1, 'mu', 'm2', 666.6666667],
    ['area', 1, 'acre', 'm2', 4046.8564224],
    ['area', 1, 'ft2', 'm2', 0.09290304],
    ['area', 1, 'ping', 'm2', 3.3057851],
    ['area', 1, 'ha', 'mu', 15],
    ['weight', 1, 'lb', 'kg', 0.45359237],
    ['weight', 1, 'jin', 'g', 500],
    ['weight', 1, 'liang', 'g', 50],
    ['weight', 1, 'oz', 'g', 28.349523125],
    ['weight', 1, 'kg', 'jin', 2],
    ['weight', 1, 'st', 'lb', 14],
    ['volume', 1, 'cup', 'ml', 236.5882365],
    ['volume', 1, 'gal', 'l', 3.785411784],
    ['volume', 1, 'floz', 'ml', 29.5735296],
    ['volume', 1, 'tbsp', 'tsp', 3],
    ['speed', 100, 'kmh', 'mph', 62.1371192],
    ['speed', 1, 'kn', 'kmh', 1.852],
    ['pressure', 32, 'psi', 'kpa', 220.6322334],
    ['pressure', 1, 'bar', 'psi', 14.5037738],
    ['energy', 1, 'kcal', 'kj', 4.184],
    ['energy', 1, 'kwh', 'kj', 3600],
  ])('%s: %d %s → %s', (category, value, from, to, expected) => {
    expect(conv(category, value, from, to)).toBeCloseTo(expected, 6);
  });
});

describe('non-linear conversions', () => {
  test('temperature', () => {
    expect(conv('temperature', 100, 'c', 'f')).toBeCloseTo(212);
    expect(conv('temperature', -40, 'f', 'c')).toBeCloseTo(-40);
    expect(conv('temperature', 98.6, 'f', 'c')).toBeCloseTo(37);
    expect(conv('temperature', 0, 'k', 'c')).toBeCloseTo(-273.15);
  });

  test('fuel economy', () => {
    expect(conv('fuel', 10, 'l100', 'kml')).toBeCloseTo(10);
    expect(conv('fuel', 10, 'l100', 'mpg')).toBeCloseTo(23.5214583, 5);
    expect(conv('fuel', 30, 'mpg', 'l100')).toBeCloseTo(7.8404861, 5);
  });

  test('round trips are lossless for every unit', () => {
    CATEGORIES.filter((c) => c.units?.length && !c.kind).forEach((category) => {
      category.units.forEach((from) => {
        category.units.forEach((to) => {
          const there = convert(12.5, from, to);
          expect(convert(there, to, from)).toBeCloseTo(12.5, 6);
        });
      });
    });
  });
});

describe('cooking', () => {
  const cooking = getCategory('cooking');
  const u = (id) => cooking.units.find((x) => x.id === id);
  const flour = INGREDIENTS.find((i) => i.id === 'flour');
  const water = INGREDIENTS.find((i) => i.id === 'water');

  test('1 cup flour ≈ 120 g', () => {
    expect(convertCooking(1, u('cup'), u('g'), flour)).toBeCloseTo(120);
  });

  test('water: 1 cup ≈ 236.6 g and 1 mL ≈ 1 g', () => {
    expect(convertCooking(1, u('cup'), u('g'), water)).toBeCloseTo(236.6, 1);
    expect(convertCooking(100, u('ml'), u('g'), water)).toBeCloseTo(100, 0);
  });

  test('volume ↔ volume does not depend on the ingredient', () => {
    expect(convertCooking(1, u('cup'), u('tbsp'), flour)).toBeCloseTo(16);
    expect(convertCooking(1, u('cup'), u('tbsp'), water)).toBeCloseTo(16);
  });
});

test('currency uses USD-based rates', () => {
  const rates = { USD: 1, CAD: 1.4, CNY: 7.2 };
  expect(convertCurrency(100, 'CAD', 'CNY', rates)).toBeCloseTo((100 / 1.4) * 7.2);
  expect(convertCurrency(1, 'USD', 'CAD', rates)).toBeCloseTo(1.4);
  expect(Number.isNaN(convertCurrency(1, 'USD', 'XXX', rates))).toBe(true);
});

describe('evaluateInput', () => {
  test('plain numbers and arithmetic', () => {
    expect(evaluateInput('12.5')).toBe(12.5);
    expect(evaluateInput('1.5+0.75')).toBe(2.25);
    expect(evaluateInput('2+3×4')).toBe(14);
    expect(evaluateInput('10÷4')).toBe(2.5);
    expect(evaluateInput('-5')).toBe(-5);
    expect(evaluateInput('5×-2')).toBe(-10);
    expect(evaluateInput('.5')).toBe(0.5);
  });

  test('incomplete or invalid input is NaN', () => {
    expect(evaluateInput('')).toBeNaN();
    expect(evaluateInput('5+')).toBeNaN();
    expect(evaluateInput('abc')).toBeNaN();
    expect(evaluateInput('1÷0')).toBeNaN();
  });

  test('feet and inches', () => {
    expect(evaluateInput('5′11″', 'ftin')).toBeCloseTo(5 + 11 / 12);
    expect(evaluateInput('5′', 'ftin')).toBe(5);
    expect(evaluateInput('6″', 'ftin')).toBe(0.5);
  });

  test('斤两 and lb oz', () => {
    expect(evaluateInput('1斤2两', 'jinliang')).toBeCloseTo(1.2);
    expect(evaluateInput('3lb4oz', 'lboz')).toBeCloseTo(3.25);
  });

  test('compound markers are not accepted for other units', () => {
    expect(evaluateInput('5′11″')).toBeNaN();
  });

  test('isExpression', () => {
    expect(isExpression('12.5')).toBe(false);
    expect(isExpression('-3')).toBe(false);
    expect(isExpression('1+2')).toBe(true);
    expect(isExpression('5-2')).toBe(true);
    expect(isExpression('5′11″')).toBe(true);
  });
});

describe('formatting', () => {
  test('formatNumber', () => {
    expect(formatNumber(1234567.891)).toBe('1,234,568');
    expect(formatNumber(2.54)).toBe('2.54');
    expect(formatNumber(0.1 + 0.2)).toBe('0.3');
    expect(formatNumber(0)).toBe('0');
    expect(formatNumber(NaN)).toBe('—');
    expect(formatNumber(1.5e-8)).toBe('1.5×10⁻⁸');
  });

  test('plainNumber has no grouping', () => {
    expect(plainNumber(1234567.891)).toBe('1234568');
    expect(plainNumber(175.26)).toBe('175.26');
  });

  test('formatCompound', () => {
    expect(formatCompound(5.75, 'ftin')).toBe('5′ 9″');
    expect(formatCompound(1.2, 'jinliang')).toBe('1斤2两');
    expect(formatCompound(3.25, 'lboz')).toBe('3 lb 4 oz');
    expect(formatCompound(5.999, 'ftin')).toBe('6′ 0″');
  });
});

describe('size tables', () => {
  test('nearest shoe row by EU size', () => {
    const rows = SIZE_TABLES.shoes.groups.men.rows;
    const index = nearestSizeRow(rows, 2, 42);
    expect(rows[index][3]).toBe(8.5); // US 8.5
  });

  test('ranges match by midpoint', () => {
    const rows = SIZE_TABLES.clothes.groups.men.rows;
    const index = nearestSizeRow(rows, 4, 96);
    expect(rows[index][0]).toBe('L');
  });

  test('every row has one cell per column', () => {
    Object.values(SIZE_TABLES).forEach((table) => {
      Object.values(table.groups).forEach((group) => {
        group.rows.forEach((row) => expect(row).toHaveLength(table.columns.length));
      });
    });
  });
});
