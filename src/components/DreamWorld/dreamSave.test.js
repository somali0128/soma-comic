import {
  DREAM_SAVE_KEY,
  createDreamSave,
  loadDreamSave,
  normalizeDreamSave,
  recordDreamFishingCatch,
  recordDreamFragment,
  recordDreamPosition,
  recordDreamTutorialStep,
  resetDreamSave,
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
    expect(save.world.caughtFishingIds).toEqual([]);
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
        caughtFishingIds: ['moon-on-the-line', 'moon-on-the-line', false],
        flags: null,
      },
    });

    expect(save.world.discoveredSceneIds).toEqual(['threshold-meadow']);
    expect(save.world.collectedFragmentIds).toEqual(['first-light']);
    expect(save.world.caughtFishingIds).toEqual(['moon-on-the-line']);
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

  test('records the exact player position and discovers the scene', () => {
    const positioned = recordDreamPosition(createDreamSave(), 'northeast-shore', {
      x: 812.5,
      y: 466,
    });

    expect(positioned.player.currentSceneId).toBe('northeast-shore');
    expect(positioned.player.position).toEqual({ x: 812.5, y: 466 });
    expect(positioned.world.discoveredSceneIds).toContain('northeast-shore');
  });

  test('records each tutorial step only once', () => {
    const moved = recordDreamTutorialStep(createDreamSave(), 'tutorial-move');
    const duplicate = recordDreamTutorialStep(moved, 'tutorial-move');

    expect(duplicate.tutorial.completedStepIds).toEqual(['tutorial-move']);
  });

  test('migrates version 1 saves without losing existing progress', () => {
    const legacy = {
      ...createDreamSave(),
      version: 1,
      world: {
        discoveredSceneIds: ['threshold-meadow'],
        collectedFragmentIds: ['lakeside-fishing'],
        flags: { remembered: true },
      },
    };

    const migrated = normalizeDreamSave(legacy);

    expect(migrated.version).toBe(2);
    expect(migrated.world.collectedFragmentIds).toEqual(['lakeside-fishing']);
    expect(migrated.world.caughtFishingIds).toEqual([]);
    expect(migrated.world.flags).toEqual({ remembered: true });
  });

  test('records each fishing catch once and persists it', () => {
    const caught = recordDreamFishingCatch(createDreamSave(), 'moon-on-the-line');
    const duplicate = recordDreamFishingCatch(caught, 'moon-on-the-line');

    expect(duplicate.world.caughtFishingIds).toEqual(['moon-on-the-line']);
    expect(saveDreamSave(duplicate)).toBe(true);
    expect(loadDreamSave().world.caughtFishingIds).toEqual(['moon-on-the-line']);
  });

  test('resets every Dream World namespace', () => {
    const progressed = recordDreamFishingCatch(
      recordDreamTutorialStep(
        recordDreamFragment(
          recordDreamPosition(createDreamSave(), 'threshold-meadow', { x: 900, y: 500 }),
          'maomao-is-wife'
        ),
        'tutorial-move'
      ),
      'moon-on-the-line'
    );
    saveDreamSave(progressed);

    expect(resetDreamSave()).toEqual(createDreamSave());
    expect(loadDreamSave()).toEqual(createDreamSave());
  });
});
