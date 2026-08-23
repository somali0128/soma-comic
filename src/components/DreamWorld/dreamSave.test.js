import {
  DREAM_SAVE_KEY,
  createDreamSave,
  loadDreamSave,
  normalizeDreamSave,
  recordDreamFragment,
  saveDreamSave,
} from './dreamSave';

describe('Dream World save data', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  test('starts at the configured entry scene', () => {
    const save = createDreamSave();

    expect(save.player.currentSceneId).toBe('threshold-meadow');
    expect(save.world.discoveredSceneIds).toEqual(['threshold-meadow']);
    expect(save.world.collectedFragmentIds).toEqual([]);
  });

  test('falls back safely when stored JSON is corrupt', () => {
    window.localStorage.setItem(DREAM_SAVE_KEY, '{broken');

    expect(loadDreamSave()).toEqual(createDreamSave());
  });

  test('normalizes unknown or duplicate collection data', () => {
    const save = normalizeDreamSave({
      ...createDreamSave(),
      world: {
        discoveredSceneIds: ['threshold-meadow', 'threshold-meadow', null],
        collectedFragmentIds: ['first-light', 'first-light', 7],
        flags: null,
      },
    });

    expect(save.world.discoveredSceneIds).toEqual(['threshold-meadow']);
    expect(save.world.collectedFragmentIds).toEqual(['first-light']);
    expect(save.world.flags).toEqual({});
  });

  test('records each fragment once and persists it', () => {
    const initial = createDreamSave();
    const collected = recordDreamFragment(initial, 'first-light');
    const duplicate = recordDreamFragment(collected, 'first-light');

    expect(duplicate.world.collectedFragmentIds).toEqual(['first-light']);
    expect(saveDreamSave(duplicate)).toBe(true);
    expect(loadDreamSave()).toEqual(duplicate);
  });
});
