export const DREAM_TUTORIAL_STEPS = {
  MOVE: 'tutorial-move',
  TALK: 'tutorial-talk',
  COLLECT: 'tutorial-collect',
};

export const DREAM_TUTORIAL_STEP_IDS = Object.values(DREAM_TUTORIAL_STEPS);

export const dreamWorldFoundation = {
  id: 'soma-dream-world',
  version: 4,
  startRegion: 'northeast-lake',
  startScene: 'threshold-meadow',
  regions: [
    {
      id: 'northeast-lake',
      sceneIds: ['threshold-meadow'],
    },
  ],
  scenes: [
    {
      id: 'threshold-meadow',
      regionId: 'northeast-lake',
      status: 'durable-vertical-slice',
      spawn: { id: 'meadow-entry', x: 700, y: 535 },
      npcIds: ['maomao', 'friend-1', 'friend-2'],
      fragmentIds: ['lakeside-fishing', 'wife-loves-water', 'maomao-is-wife'],
      fishingSpotIds: ['moonlit-lake-bank'],
      obstacles: [
        [445, 245, 350, 245],
        [1025, 170, 370, 250],
        [770, 780, 425, 205],
        [45, 560, 90, 780],
        [1495, 560, 82, 780],
        [765, 28, 1530, 56],
        [765, 1000, 1530, 48],
        [135, 365, 170, 190],
        [1385, 310, 210, 230],
        [1325, 735, 260, 240],
        [190, 875, 300, 230],
      ],
    },
  ],
  npcs: [
    {
      id: 'maomao',
      sceneId: 'threshold-meadow',
      x: 905,
      y: 500,
      frame: 1,
      tint: 0xf2c0db,
      nameUnlock: { requiresAllFragments: true },
    },
    {
      id: 'friend-1',
      sceneId: 'threshold-meadow',
      x: 455,
      y: 600,
      frame: 1,
      tint: 0xb9ddff,
      nameUnlock: { futureClue: 'friend-1-name' },
    },
    {
      id: 'friend-2',
      sceneId: 'threshold-meadow',
      x: 1155,
      y: 650,
      frame: 1,
      tint: 0xd9c4ff,
      nameUnlock: { futureClue: 'friend-2-name' },
    },
  ],
  fragments: [
    {
      id: 'lakeside-fishing',
      sceneId: 'threshold-meadow',
      x: 505,
      y: 690,
      color: 0x9ef8ff,
    },
    {
      id: 'wife-loves-water',
      sceneId: 'threshold-meadow',
      x: 1165,
      y: 505,
      color: 0xffd7a1,
    },
    {
      id: 'maomao-is-wife',
      sceneId: 'threshold-meadow',
      x: 1080,
      y: 735,
      color: 0xf8a8e6,
    },
  ],
  fishingSpots: [
    {
      id: 'moonlit-lake-bank',
      sceneId: 'threshold-meadow',
      x: 1020,
      y: 825,
      bobberX: 948,
      bobberY: 812,
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
