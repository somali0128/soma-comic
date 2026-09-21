import { REGION_DEFINITIONS, STREET_SHOPS } from './dreamRegions';
import { TILE_TYPES, worldToCell, nextGridCell, cellDistance, isWalkable } from './lakesideMap';
import { dreamWorldFoundation, getSceneNpcs } from './dreamWorldData';
import { createDreamSave, normalizeDreamSave, travelDreamPortal } from './dreamSave';

const byId = (id) => REGION_DEFINITIONS.find((scene) => scene.id === id);

test.each(REGION_DEFINITIONS.map((scene) => [scene.id, scene]))('%s has consistent tiles and reachable entrances/exits', (_, scene) => {
  scene.map.forEach((row) => {
    expect(row.length).toBe(scene.map[0].length);
    [...row].forEach((code) => expect(TILE_TYPES[code]).toBeDefined());
  });
  const occupied = getSceneNpcs(scene.id).map(worldToCell);
  const queue = [worldToCell(scene.spawn)];
  const visited = new Set(queue.map(({ col, row }) => `${col},${row}`));
  for (let i = 0; i < queue.length; i += 1) {
    ['up', 'down', 'left', 'right'].forEach((direction) => {
      const next = nextGridCell(queue[i], direction, occupied, scene.map);
      if (!next) return;
      const key = `${next.col},${next.row}`;
      if (!visited.has(key)) { visited.add(key); queue.push(next); }
    });
  }
  Object.values(scene.entrances).forEach((position) => {
    const cell = worldToCell(position);
    expect(visited.has(`${cell.col},${cell.row}`)).toBe(true);
    expect(scene.portals.some((portal) => cellDistance(portal, cell) === 0)).toBe(false);
  });
  scene.portals.forEach((portal) => {
    expect(visited.has(`${portal.col},${portal.row}`)).toBe(true);
    const target = byId(portal.to);
    expect(target.entrances[portal.entrance]).toBeDefined();
    expect(target.portals.some(({ to }) => to === scene.id)).toBe(true);
  });
  occupied.forEach((cell) => expect(queue.some((candidate) => cellDistance(candidate, cell) === 1)).toBe(true));
});

test('lake only exits south, and mall has exactly west/east/south connections', () => {
  expect(byId('threshold-meadow').portals.map(({ direction }) => direction)).toEqual(['down']);
  const lake = byId('threshold-meadow').map;
  lake.forEach((row) => expect(TILE_TYPES[row[0]].walkable).toBe(false));
  const mall = byId('eastern-mall');
  expect(mall.portals.map(({ direction }) => direction).sort()).toEqual(['down', 'left', 'right']);
  expect(mall.portals.map(({ to }) => to).sort()).toEqual(['mall-south-road', 'mall-west-road', 'outdoor-stadium']);
  expect([...mall.map[0]].every((tile) => !TILE_TYPES[tile].walkable)).toBe(true);
  expect(byId('snack-street').portals.some(({ to }) => to === mall.id)).toBe(false);
});

test('the blue fox stands in front of the herbal pharmacy and remains interactable', () => {
  const herbal = STREET_SHOPS.find(({ id }) => id === 'herbal');
  const fox = getSceneNpcs('snack-street').find(({ id }) => id === 'blue-fox');
  const cell = worldToCell(fox);
  expect(cell.row).toBe(herbal.row + herbal.height);
  expect(cell.col).toBeGreaterThanOrEqual(herbal.col);
  expect(cell.col).toBeLessThan(herbal.col + herbal.width);
  expect(isWalkable(cell.col, cell.row, [], byId('snack-street').map)).toBe(true);
});

test('travel, save restoration and reverse travel preserve memories across every region', () => {
  let save = createDreamSave();
  save.world.collectedFragmentIds = ['lakeside-fishing'];
  save.world.caughtFishingIds = ['moon-on-the-line'];
  save.tutorial.completedStepIds = ['tutorial-move'];
  const route = ['lake-south', 'street-south', 'west-mall', 'mall-east', 'stadium-west', 'mall-south', 'south-west', 'west-north', 'street-north'];
  route.forEach((portalId) => {
    const source = byId(save.player.currentSceneId);
    const portal = source.portals.find(({ id }) => id === portalId);
    save = travelDreamPortal(save, portalId);
    expect(save.player.currentSceneId).toBe(portal.to);
    expect(save.player.position).toEqual(byId(portal.to).entrances[portal.entrance]);
    const restored = normalizeDreamSave(JSON.parse(JSON.stringify(save)));
    expect(restored).toEqual(save);
    expect(save.world.collectedFragmentIds).toEqual(['lakeside-fishing']);
    expect(save.world.caughtFishingIds).toEqual(['moon-on-the-line']);
    expect(save.tutorial.completedStepIds).toEqual(['tutorial-move']);
  });
  expect(save.world.discoveredSceneIds.length).toBe(dreamWorldFoundation.scenes.length);
});

test('unknown or unrelated portals cannot teleport a save', () => {
  const save = createDreamSave();
  expect(travelDreamPortal(save, 'mall-east')).toEqual(save);
  expect(travelDreamPortal(save, 'does-not-exist')).toEqual(save);
});
