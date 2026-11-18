import { applyKey, currentEntry, defaultState, loadState, saveState, STATE_KEY } from './convertState';
import { evaluateInput, plainNumber } from './units';

const press = (keys, start = '') => keys.reduce((input, key) => applyKey(input, key, { evaluate: evaluateInput, format: plainNumber }), start);

describe('keypad', () => {
  test('digits and decimal point', () => {
    expect(press(['1', '2', '.', '5'])).toBe('12.5');
    expect(press(['.', '5'])).toBe('0.5');
    expect(press(['1', '.', '.', '2'])).toBe('1.2');
    expect(press(['0', '0', '7'])).toBe('7');
  });

  test('operators replace each other but allow a negative operand', () => {
    expect(press(['5', '+', '×'])).toBe('5×');
    expect(press(['5', '×', '-', '2'])).toBe('5×-2');
    expect(press(['5', '×', '-', '+'])).toBe('5+');
    expect(press(['+'])).toBe('');
    expect(press(['-', '3'])).toBe('-3');
  });

  test('sign toggles the last number', () => {
    expect(press(['5', 'sign'])).toBe('-5');
    expect(press(['5', 'sign', 'sign'])).toBe('5');
    expect(press(['2', '+', '3', 'sign'])).toBe('2+-3');
  });

  test('backspace, clear and equals', () => {
    expect(press(['1', '2', 'back'])).toBe('1');
    expect(press(['3', 'lb', 'back'], '')).toBe('3');
    expect(press(['1', '2', 'clear'])).toBe('');
    expect(press(['1', '.', '5', '+', '2', '='])).toBe('3.5');
    expect(press(['5', '+', '='])).toBe('5+');
  });

  test('compound markers only once', () => {
    expect(press(['5', '′', '′', '1', '1', '″'])).toBe('5′11″');
    expect(press(['′'])).toBe('');
  });

  test('length is capped', () => {
    expect(press(Array(40).fill('9'))).toHaveLength(24);
  });
});

describe('state persistence', () => {
  beforeEach(() => window.localStorage.clear());

  test('defaults when nothing is stored', () => {
    expect(loadState()).toEqual(defaultState());
  });

  test('round trip and validation', () => {
    const state = { ...defaultState(), category: 'weight', stars: { weight: ['jin'] } };
    expect(saveState(state)).toBe(true);
    expect(loadState().category).toBe('weight');
    window.localStorage.setItem(STATE_KEY, JSON.stringify({ category: 'nope', ingredient: 'nope' }));
    expect(loadState().category).toBe('length');
    expect(loadState().ingredient).toBe('flour');
  });

  test('corrupted storage falls back to defaults', () => {
    window.localStorage.setItem(STATE_KEY, '{oops');
    expect(loadState()).toEqual(defaultState());
    const broken = { getItem: () => { throw new Error('x'); }, setItem: () => { throw new Error('x'); } };
    expect(loadState(broken)).toEqual(defaultState());
    expect(saveState(defaultState(), broken)).toBe(false);
  });

  test('currentEntry falls back to the category default unit', () => {
    const state = { ...defaultState(), perCategory: { length: { unit: 'bogus', input: '3' } } };
    expect(currentEntry(state, 'length')).toEqual({ unit: 'cm', input: '3' });
    expect(currentEntry(defaultState(), 'shoes')).toEqual({ unit: 'eu', input: '42' });
    expect(currentEntry(defaultState(), 'currency').unit).toBe('CAD');
  });
});
