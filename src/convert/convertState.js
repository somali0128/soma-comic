/**
 * Persistent state + keypad editing rules for the 换算 app.
 * Pure functions so they can be unit-tested without a browser.
 */

import { CATEGORIES, CURRENCIES, INGREDIENTS, SIZE_TABLES, getCategory } from './units';

export const STATE_KEY = 'soma-convert-state-v1';
export const MAX_INPUT_LENGTH = 24;

export function defaultState() {
  return {
    category: 'length',
    perCategory: {},
    stars: {},
    ingredient: 'flour',
    sizeGroup: { shoes: 'men', clothes: 'men' },
  };
}

const safeStorage = () => {
  try {
    return typeof window === 'undefined' ? null : window.localStorage;
  } catch {
    return null;
  }
};

export function loadState(storage = safeStorage()) {
  const base = defaultState();
  if (!storage) return base;
  try {
    const saved = JSON.parse(storage.getItem(STATE_KEY) || 'null');
    if (!saved || typeof saved !== 'object') return base;
    const state = {
      ...base,
      ...saved,
      perCategory: { ...(saved.perCategory || {}) },
      stars: { ...(saved.stars || {}) },
      sizeGroup: { ...base.sizeGroup, ...(saved.sizeGroup || {}) },
    };
    if (!CATEGORIES.some((category) => category.id === state.category)) state.category = base.category;
    if (!INGREDIENTS.some((ingredient) => ingredient.id === state.ingredient)) state.ingredient = base.ingredient;
    return state;
  } catch {
    return base;
  }
}

export function saveState(state, storage = safeStorage()) {
  if (!storage) return false;
  try {
    storage.setItem(STATE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

/** Units the user can pick as input for a category (size tables: numeric columns). */
export function inputUnitsFor(categoryId) {
  const category = getCategory(categoryId);
  if (category.kind === 'currency') return CURRENCIES;
  if (category.kind === 'table') {
    const table = SIZE_TABLES[categoryId];
    return table.columns.filter((column) => table.numericColumns?.includes(column.id) ?? true);
  }
  return category.units;
}

export function currentEntry(state, categoryId) {
  const category = getCategory(categoryId);
  const units = inputUnitsFor(categoryId);
  const saved = state.perCategory[categoryId] || {};
  const fallbackUnit = units.some((unit) => unit.id === category.defaultUnit) ? category.defaultUnit : units[0]?.id;
  const unit = units.some((u) => u.id === saved.unit) ? saved.unit : fallbackUnit;
  const input = typeof saved.input === 'string' ? saved.input : category.defaultInput ?? '1';
  return { unit, input };
}

/* ------------------------------------------------------------------ */
/* Keypad editing                                                      */
/* ------------------------------------------------------------------ */

const OPERATORS = ['+', '-', '×', '÷'];
const isOperator = (ch) => OPERATORS.includes(ch);

/** Split off the number being typed at the end of the input. */
function lastNumber(input) {
  const match = /(\d*\.?\d*)$/.exec(input);
  return match ? match[1] : '';
}

/**
 * Apply one keypad key to the input string.
 * key: '0'-'9', '.', '+', '-', '×', '÷', 'back', 'clear', 'sign', '=' or a
 * compound marker such as '′', '″', '斤', '两', 'lb', 'oz'.
 * `evaluate` is used by '=' to collapse an expression into its result.
 */
export function applyKey(input, key, { evaluate, format } = {}) {
  const text = String(input ?? '');

  if (key === 'clear') return '';
  if (key === 'back') {
    for (const marker of ['lb', 'oz']) if (text.endsWith(marker)) return text.slice(0, -marker.length);
    return Array.from(text).slice(0, -1).join('');
  }
  if (key === '=') {
    if (!evaluate) return text;
    const value = evaluate(text);
    return Number.isFinite(value) ? format(value) : text;
  }
  if (text.length >= MAX_INPUT_LENGTH) return text;

  if (/^\d$/.test(key)) {
    const current = lastNumber(text);
    if (current === '0') return text.slice(0, -1) + key; // no leading zeros
    return text + key;
  }
  if (key === '.') {
    const current = lastNumber(text);
    if (current.includes('.')) return text;
    return text + (current === '' ? '0.' : '.');
  }
  if (key === 'sign') {
    // Toggle the sign of the number at the end.
    const current = lastNumber(text);
    const start = text.length - current.length;
    const before = text.slice(0, start);
    if (before.endsWith('-') && (before.length === 1 || isOperator(before.at(-2)))) {
      return before.slice(0, -1) + current;
    }
    if (before === '' || isOperator(before.at(-1))) return `${before}-${current}`;
    return text;
  }
  if (isOperator(key)) {
    if (text === '') return key === '-' ? '-' : text;
    const last = text.at(-1);
    if (isOperator(last)) {
      // "5×-" is allowed (negative operand); otherwise replace the operator.
      if (key === '-' && last !== '-') return text + key;
      if (text.length >= 2 && isOperator(text.at(-2))) return text.slice(0, -2) + key;
      return text.slice(0, -1) + key;
    }
    if (last === '.') return text.slice(0, -1) + key;
    return text + key;
  }
  // Compound markers (′ ″ 斤 两 lb oz) are only added once each.
  if (text === '' || text.includes(key)) return text;
  return text + key;
}

/** Shown in the input box: ASCII minus as a real minus sign. */
export const displayInput = (input) => String(input ?? '').replace(/-/g, '−');
