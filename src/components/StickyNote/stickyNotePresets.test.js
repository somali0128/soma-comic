import { PRESETS_STORAGE_KEY, loadPresets, removePreset, savePresets, upsertPreset } from './stickyNotePresets';

describe('sticky note presets', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  test('round-trips through localStorage', () => {
    const presets = upsertPreset([], '直播开场', { text: '马上开始！', paper: 'pink', size: 1024 }, 1);
    expect(savePresets(presets)).toBe(true);
    const loaded = loadPresets();
    expect(loaded).toHaveLength(1);
    expect(loaded[0].name).toBe('直播开场');
    expect(loaded[0].options).toEqual({ text: '马上开始！', paper: 'pink' });
  });

  test('replaces a preset with the same name', () => {
    let presets = upsertPreset([], 'A', { text: '1' }, 1);
    presets = upsertPreset(presets, 'A', { text: '2' }, 2);
    expect(presets).toHaveLength(1);
    expect(presets[0].options.text).toBe('2');
  });

  test('ignores empty names and removes by id', () => {
    const presets = upsertPreset([], '   ', { text: 'x' });
    expect(presets).toEqual([]);
    const two = upsertPreset(upsertPreset([], 'A', {}, 1), 'B', {}, 2);
    expect(removePreset(two, two[0].id).map((p) => p.name)).toEqual(['A']);
  });

  test('survives corrupted JSON and unexpected shapes', () => {
    window.localStorage.setItem(PRESETS_STORAGE_KEY, '{not json');
    expect(loadPresets()).toEqual([]);
    window.localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify([{ id: 1 }, null, { id: 'ok', name: 'ok', options: {} }]));
    expect(loadPresets().map((p) => p.id)).toEqual(['ok']);
  });

  test('survives a storage that throws', () => {
    const broken = {
      getItem: () => {
        throw new Error('denied');
      },
      setItem: () => {
        throw new Error('quota');
      },
    };
    expect(loadPresets(broken)).toEqual([]);
    expect(savePresets([], broken)).toBe(false);
  });
});
