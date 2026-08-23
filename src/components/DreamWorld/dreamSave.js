import { dreamWorldFoundation } from './dreamWorldData';

export const DREAM_SAVE_KEY = 'soma.dream-world.save';
export const DREAM_SAVE_VERSION = 1;

const uniqueStrings = (value) => (
  Array.isArray(value)
    ? [...new Set(value.filter((item) => typeof item === 'string' && item.length > 0))]
    : []
);

const safeRecord = (value) => (
  value && typeof value === 'object' && !Array.isArray(value) ? { ...value } : {}
);

export const createDreamSave = () => ({
  version: DREAM_SAVE_VERSION,
  player: {
    currentSceneId: dreamWorldFoundation.startScene,
    spawnId: 'meadow-entry',
    position: null,
  },
  world: {
    discoveredSceneIds: [dreamWorldFoundation.startScene],
    collectedFragmentIds: [],
    flags: {},
  },
  tutorial: {
    completedStepIds: [],
  },
});

export const normalizeDreamSave = (value) => {
  const fallback = createDreamSave();

  if (!value || value.version !== DREAM_SAVE_VERSION) return fallback;

  const currentSceneId = typeof value.player?.currentSceneId === 'string'
    ? value.player.currentSceneId
    : fallback.player.currentSceneId;
  const spawnId = typeof value.player?.spawnId === 'string'
    ? value.player.spawnId
    : fallback.player.spawnId;
  const position = Number.isFinite(value.player?.position?.x)
    && Number.isFinite(value.player?.position?.y)
    ? { x: value.player.position.x, y: value.player.position.y }
    : null;
  const discoveredSceneIds = uniqueStrings(value.world?.discoveredSceneIds);

  return {
    version: DREAM_SAVE_VERSION,
    player: { currentSceneId, spawnId, position },
    world: {
      discoveredSceneIds: discoveredSceneIds.length
        ? discoveredSceneIds
        : fallback.world.discoveredSceneIds,
      collectedFragmentIds: uniqueStrings(value.world?.collectedFragmentIds),
      flags: safeRecord(value.world?.flags),
    },
    tutorial: {
      completedStepIds: uniqueStrings(value.tutorial?.completedStepIds),
    },
  };
};

const getBrowserStorage = () => {
  try {
    return typeof window === 'undefined' ? null : window.localStorage;
  } catch {
    return null;
  }
};

export const loadDreamSave = (storage = getBrowserStorage()) => {
  if (!storage) return createDreamSave();

  try {
    const rawSave = storage.getItem(DREAM_SAVE_KEY);
    return rawSave ? normalizeDreamSave(JSON.parse(rawSave)) : createDreamSave();
  } catch {
    return createDreamSave();
  }
};

export const saveDreamSave = (save, storage = getBrowserStorage()) => {
  if (!storage) return false;

  try {
    storage.setItem(DREAM_SAVE_KEY, JSON.stringify(normalizeDreamSave(save)));
    return true;
  } catch {
    return false;
  }
};

export const recordDreamFragment = (save, fragmentId) => {
  const normalized = normalizeDreamSave(save);
  if (typeof fragmentId !== 'string' || fragmentId.length === 0) return normalized;
  if (normalized.world.collectedFragmentIds.includes(fragmentId)) return normalized;

  return {
    ...normalized,
    world: {
      ...normalized.world,
      collectedFragmentIds: [...normalized.world.collectedFragmentIds, fragmentId],
    },
  };
};
