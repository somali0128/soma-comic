import { dreamWorldFoundation } from './dreamWorldData';
import { resolveGridPosition, worldToCell } from './lakesideMap';
import { getRegionMap } from './dreamRegions';

export const DREAM_SAVE_KEY = 'soma.dream-world.save';
export const DREAM_SAVE_VERSION = 3;
const SUPPORTED_DREAM_SAVE_VERSIONS = [1, 2, DREAM_SAVE_VERSION];

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
    caughtFishingIds: [],
    flags: {},
  },
  tutorial: {
    completedStepIds: [],
  },
});

export const normalizeDreamSave = (value) => {
  const fallback = createDreamSave();

  if (!value || !SUPPORTED_DREAM_SAVE_VERSIONS.includes(value.version)) return fallback;

  const currentSceneId = typeof value.player?.currentSceneId === 'string'
    ? value.player.currentSceneId
    : fallback.player.currentSceneId;
  const spawnId = typeof value.player?.spawnId === 'string'
    ? value.player.spawnId
    : fallback.player.spawnId;
  let position = Number.isFinite(value.player?.position?.x)
    && Number.isFinite(value.player?.position?.y)
    ? { x: value.player.position.x, y: value.player.position.y }
    : null;
  const scene = dreamWorldFoundation.scenes.find(({ id }) => id === currentSceneId);
  if (position && scene?.mapRevision) {
    const occupied = dreamWorldFoundation.npcs.filter((npc) => npc.sceneId === scene.id).map(worldToCell);
    position = resolveGridPosition(position, scene.spawn, occupied, getRegionMap(scene.id));
  }
  const discoveredSceneIds = uniqueStrings(value.world?.discoveredSceneIds);

  return {
    version: DREAM_SAVE_VERSION,
    player: { currentSceneId, spawnId, position },
    world: {
      discoveredSceneIds: discoveredSceneIds.length
        ? discoveredSceneIds
        : fallback.world.discoveredSceneIds,
      collectedFragmentIds: uniqueStrings(value.world?.collectedFragmentIds),
      caughtFishingIds: uniqueStrings(value.world?.caughtFishingIds),
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

export const recordDreamFishingCatch = (save, catchId) => {
  const normalized = normalizeDreamSave(save);
  if (typeof catchId !== 'string' || catchId.length === 0) return normalized;
  if (normalized.world.caughtFishingIds.includes(catchId)) return normalized;

  return {
    ...normalized,
    world: {
      ...normalized.world,
      caughtFishingIds: [...normalized.world.caughtFishingIds, catchId],
    },
  };
};

export const recordDreamPosition = (save, sceneId, position) => {
  const normalized = normalizeDreamSave(save);
  if (typeof sceneId !== 'string' || sceneId.length === 0) return normalized;
  if (!Number.isFinite(position?.x) || !Number.isFinite(position?.y)) return normalized;

  return {
    ...normalized,
    player: {
      ...normalized.player,
      currentSceneId: sceneId,
      position: { x: position.x, y: position.y },
    },
    world: {
      ...normalized.world,
      discoveredSceneIds: normalized.world.discoveredSceneIds.includes(sceneId)
        ? normalized.world.discoveredSceneIds
        : [...normalized.world.discoveredSceneIds, sceneId],
    },
  };
};

export const recordDreamTutorialStep = (save, stepId) => {
  const normalized = normalizeDreamSave(save);
  if (typeof stepId !== 'string' || stepId.length === 0) return normalized;
  if (normalized.tutorial.completedStepIds.includes(stepId)) return normalized;

  return {
    ...normalized,
    tutorial: {
      ...normalized.tutorial,
      completedStepIds: [...normalized.tutorial.completedStepIds, stepId],
    },
  };
};

export const travelDreamPortal = (save, portalId) => {
  const normalized = normalizeDreamSave(save);
  const source = dreamWorldFoundation.scenes.find(({ id }) => id === normalized.player.currentSceneId);
  const portal = source?.portals.find(({ id }) => id === portalId);
  const target = dreamWorldFoundation.scenes.find(({ id }) => id === portal?.to);
  const position = target?.entrances[portal?.entrance];
  if (!portal || !target || !position) return normalized;
  const traveled = recordDreamPosition(normalized, target.id, position);
  return { ...traveled, player: { ...traveled.player, spawnId: portal.entrance } };
};

export const resetDreamSave = (storage = getBrowserStorage()) => {
  const freshSave = createDreamSave();
  saveDreamSave(freshSave, storage);
  return freshSave;
};
