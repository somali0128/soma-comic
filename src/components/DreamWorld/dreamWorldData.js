import { cellToWorld } from './lakesideMap';
import { REGION_DEFINITIONS } from './dreamRegions';

export const DREAM_TUTORIAL_STEPS = {
  MOVE: 'tutorial-move',
  TALK: 'tutorial-talk',
  COLLECT: 'tutorial-collect',
};

export const DREAM_TUTORIAL_STEP_IDS = Object.values(DREAM_TUTORIAL_STEPS);

export const dreamWorldFoundation = {
  id: 'soma-dream-world',
  version: 5,
  startRegion: 'northeast-lake',
  startScene: 'threshold-meadow',
  regions: [
    { id: 'northeast-lake', sceneIds: ['threshold-meadow'] },
    { id: 'eastern-streets', sceneIds: ['snack-street'] },
    { id: 'eastern-mall-district', sceneIds: ['mall-west-road', 'eastern-mall', 'outdoor-stadium', 'mall-south-road'] },
  ],
  scenes: REGION_DEFINITIONS,
  npcs: [
    {
      id: 'blue-fox', sceneId: 'snack-street',
      ...cellToWorld(24, 17), sprite: 'blue-fox',
    },
    {
      id: 'maomao',
      sceneId: 'threshold-meadow',
      ...cellToWorld(27, 14),
      frame: 1,
      tint: 0xf2c0db,
      nameUnlock: { requiresAllFragments: true },
    },
    {
      id: 'friend-1',
      sceneId: 'threshold-meadow',
      ...cellToWorld(8, 13),
      frame: 1,
      tint: 0xb9ddff,
      nameUnlock: { futureClue: 'friend-1-name' },
    },
    {
      id: 'friend-2',
      sceneId: 'threshold-meadow',
      ...cellToWorld(20, 18),
      frame: 1,
      tint: 0xd9c4ff,
      nameUnlock: { futureClue: 'friend-2-name' },
    },
  ],
  fragments: [
    {
      id: 'lakeside-fishing',
      sceneId: 'threshold-meadow',
      ...cellToWorld(8, 9),
      color: 0x9ef8ff,
    },
    {
      id: 'wife-loves-water',
      sceneId: 'threshold-meadow',
      ...cellToWorld(25, 18),
      color: 0xffd7a1,
    },
    {
      id: 'maomao-is-wife',
      sceneId: 'threshold-meadow',
      ...cellToWorld(28, 6),
      color: 0xf8a8e6,
    },
  ],
  fishingSpots: [
    {
      id: 'moonlit-lake-bank',
      sceneId: 'threshold-meadow',
      ...cellToWorld(25, 12),
      bobberX: cellToWorld(24, 12).x,
      bobberY: cellToWorld(24, 12).y,
      facing: 'left',
      catchIds: ['moon-on-the-line', 'silver-dream-fish', 'knotted-line'],
      repeatCatchId: 'returning-ripple',
    },
  ],
};

export const getDreamScene = (sceneId = dreamWorldFoundation.startScene) => (
  dreamWorldFoundation.scenes.find((scene) => scene.id === sceneId)
  || dreamWorldFoundation.scenes[0]
);

export const getSceneNpcs = (sceneId) => (
  dreamWorldFoundation.npcs.filter((npc) => npc.sceneId === sceneId)
);

export const getSceneFragments = (sceneId) => (
  dreamWorldFoundation.fragments.filter((fragment) => fragment.sceneId === sceneId)
);

export const getSceneFishingSpots = (sceneId) => (
  dreamWorldFoundation.fishingSpots.filter((spot) => spot.sceneId === sceneId)
);
