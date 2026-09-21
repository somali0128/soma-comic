import {
  LAKESIDE_MAP, MAP_WIDTH, MAP_HEIGHT, TILE_SIZE, TILE_TYPES,
  cellToWorld, worldToCell, isWalkable, nextGridCell, resolveGridPosition, cellDistance,
} from './lakesideMap';
import { dreamWorldFoundation as world } from './dreamWorldData';
import { createDreamSave, normalizeDreamSave } from './dreamSave';

const occupied = world.npcs.filter((npc) => npc.sceneId === 'threshold-meadow').map(worldToCell);
const spawn = world.scenes[0].spawn;

test('the tile map has consistent bounds and uses known reusable tiles', () => {
  expect(LAKESIDE_MAP).toHaveLength(MAP_HEIGHT);
  LAKESIDE_MAP.forEach((row) => {
    expect(row).toHaveLength(MAP_WIDTH);
    [...row].forEach((tile) => expect(TILE_TYPES[tile]).toBeDefined());
  });
});

test('one movement travels exactly one cell and cannot enter water, trees, or NPCs', () => {
  const start = worldToCell(spawn);
  const next = nextGridCell(start, 'right', occupied);
  expect(cellToWorld(next.col, next.row).x - spawn.x).toBe(TILE_SIZE);
  expect(next.row).toBe(start.row);
  expect(nextGridCell({ col: 15, row: 4 }, 'right', occupied)).toBeNull();
  expect(nextGridCell({ col: 2, row: 6 }, 'left', occupied)).toBeNull();
  expect(nextGridCell({ col: 27, row: 15 }, 'up', occupied)).toBeNull();
  expect(nextGridCell(start, 'diagonal', occupied)).toBeNull();
  expect(nextGridCell({ col: 0, row: 0 }, 'up', occupied)).toBeNull();
});

test('all fragments, NPC interactions, and fishing can be reached from the entry', () => {
  const queue = [worldToCell(spawn)];
  const visited = new Set(queue.map(({ col, row }) => `${col},${row}`));
  for (let i = 0; i < queue.length; i += 1) {
    ['up', 'down', 'left', 'right'].forEach((direction) => {
      const next = nextGridCell(queue[i], direction, occupied);
      if (!next) return;
      const key = `${next.col},${next.row}`;
      if (!visited.has(key)) { visited.add(key); queue.push(next); }
    });
  }
  [...world.fragments, ...world.fishingSpots].forEach((entity) => {
    const cell = worldToCell(entity);
    expect(visited.has(`${cell.col},${cell.row}`)).toBe(true);
  });
  world.npcs.filter((npc) => npc.sceneId === 'threshold-meadow').forEach((npc) => {
    expect(queue.some((cell) => cellDistance(cell, worldToCell(npc)) === 1)).toBe(true);
  });
  world.fishingSpots.forEach((spot) => {
    const bobber = worldToCell({ x: spot.bobberX, y: spot.bobberY });
    expect(LAKESIDE_MAP[bobber.row][bobber.col]).toBe('~');
  });
});

test.each([{ x: 950, y: 450 }, { x: -800, y: 9000 }, world.npcs[0], { x: NaN, y: Infinity }])(
  'invalid or obsolete positions resume at a safe cell: %j', (position) => {
    const restored = resolveGridPosition(position, spawn, occupied);
    const cell = worldToCell(restored);
    expect(isWalkable(cell.col, cell.row, occupied)).toBe(true);
    expect(restored).toEqual(cellToWorld(cell.col, cell.row));
  }
);

test('version 2 free-movement saves retain memories and fishing while relocating off water', () => {
  const old = createDreamSave();
  old.version = 2;
  old.player.position = { x: 950.5, y: 450.3 };
  old.world.collectedFragmentIds = ['lakeside-fishing', 'unknown-future-fragment'];
  old.world.caughtFishingIds = ['moon-on-the-line'];
  old.tutorial.completedStepIds = ['tutorial-move'];
  const migrated = normalizeDreamSave(old);
  expect(migrated.version).toBe(3);
  expect(migrated.world).toEqual(old.world);
  expect(migrated.tutorial).toEqual(old.tutorial);
  expect(migrated.player.position).not.toEqual(old.player.position);
  const cell = worldToCell(migrated.player.position);
  expect(isWalkable(cell.col, cell.row, occupied)).toBe(true);
});
