// One character is one 48px cell. Terrain uses reusable native-resolution tiles.
export const TILE_SIZE = 48;
export const MAP_WIDTH = 32;
export const MAP_HEIGHT = 24;
export const MAP_REVISION = 'lakeside-grid-1';
export const TILE_TYPES = {
  '.': { texture: 'grass', walkable: true },
  ',': { texture: 'grass-tuft', walkable: true },
  '*': { texture: 'flowers', walkable: true },
  '=': { texture: 'path', walkable: true },
  ':': { texture: 'sand', walkable: true },
  '~': { texture: 'water', walkable: false },
  'T': { texture: 'tree', walkable: false },
  'O': { texture: 'rock', walkable: false },
  '#': { texture: 'dock', walkable: true },
  'p': { texture: 'paving', walkable: true },
  'a': { texture: 'asphalt', walkable: true },
  'f': { texture: 'marble', walkable: true },
  'w': { texture: 'wall', walkable: false },
  'b': { texture: 'brick', walkable: false },
  'r': { texture: 'roof', walkable: false },
  'g': { texture: 'glass', walkable: false },
  's': { texture: 'track', walkable: true },
  'h': { texture: 'turf', walkable: true },
  'd': { texture: 'door', walkable: true },
};

const cells = Array.from({ length: MAP_HEIGHT }, (_, row) => (
  Array.from({ length: MAP_WIDTH }, (_, col) => {
    if (col < 2 || col > 29 || row < 2 || row > 21) return 'T';
    if ((col * 7 + row * 11) % 29 === 0) return '*';
    return (col * 13 + row * 3) % 7 === 0 ? ',' : '.';
  })
));

// A stepped shoreline, with a continuous walkable ring around the lake.
for (let row = 3; row <= 15; row += 1) {
  const inset = row === 3 || row === 15 ? 2 : row === 4 || row === 14 ? 1 : 0;
  for (let col = 13 + inset; col <= 26 - inset; col += 1) cells[row][col] = ':';
}
for (let row = 4; row <= 14; row += 1) {
  const inset = row === 4 || row === 14 ? 2 : row === 5 || row === 13 ? 1 : 0;
  for (let col = 14 + inset; col <= 25 - inset; col += 1) cells[row][col] = '~';
}

for (let col = 5; col <= 28; col += 1) cells[17][col] = '=';
for (let row = 7; row <= 21; row += 1) cells[row][10] = '=';
for (let row = 6; row <= 17; row += 1) cells[row][27] = '=';
for (let col = 25; col <= 27; col += 1) {
  cells[11][col] = '#';
  cells[12][col] = '#';
}

// Small woodland groves, clearings, and rocks reuse the same tile definitions.
[[4, 4], [5, 4], [6, 4], [4, 5], [5, 5], [3, 10], [4, 10],
  [4, 11], [5, 20], [6, 20], [7, 20], [6, 21], [15, 20], [16, 20],
  [17, 20], [16, 21], [28, 20], [29, 20], [29, 19], [8, 6], [8, 7],
  [12, 8], [3, 16]].forEach(([col, row]) => { cells[row][col] = 'T'; });
[[6, 8], [12, 19], [23, 20], [28, 4]].forEach(([col, row]) => { cells[row][col] = 'O'; });
// The lake has a single exit, due south. West, east and north remain forest.
for (let row = 21; row < MAP_HEIGHT; row += 1) cells[row][10] = '=';

export const LAKESIDE_MAP = cells.map((row) => row.join(''));
export const DIRECTIONS = {
  up: { col: 0, row: -1 }, down: { col: 0, row: 1 },
  left: { col: -1, row: 0 }, right: { col: 1, row: 0 },
};
export const cellToWorld = (col, row) => ({ x: col * TILE_SIZE + TILE_SIZE / 2, y: row * TILE_SIZE + TILE_SIZE / 2 });
export const worldToCell = ({ x, y }) => ({ col: Math.floor(x / TILE_SIZE), row: Math.floor(y / TILE_SIZE) });
export const tileAt = (col, row, map = LAKESIDE_MAP) => map[row]?.[col];
export const isWalkable = (col, row, occupied = [], map = LAKESIDE_MAP) => (
  Boolean(TILE_TYPES[tileAt(col, row, map)]?.walkable)
  && !occupied.some((cell) => cell.col === col && cell.row === row)
);
export const nextGridCell = (cell, direction, occupied = [], map = LAKESIDE_MAP) => {
  const delta = DIRECTIONS[direction];
  if (!delta) return null;
  const next = { col: cell.col + delta.col, row: cell.row + delta.row };
  return isWalkable(next.col, next.row, occupied, map) ? next : null;
};
export const cellDistance = (a, b) => Math.abs(a.col - b.col) + Math.abs(a.row - b.row);

// Old free-moving saves may land inside new terrain. Find the nearest safe cell.
export const resolveGridPosition = (position, spawn, occupied = [], map = LAKESIDE_MAP) => {
  const source = Number.isFinite(position?.x) && Number.isFinite(position?.y) ? position : spawn;
  const cell = worldToCell(source);
  if (isWalkable(cell.col, cell.row, occupied, map)) return cellToWorld(cell.col, cell.row);
  const candidates = [];
  map.forEach((row, y) => [...row].forEach((_, x) => {
    if (isWalkable(x, y, occupied, map)) candidates.push({ col: x, row: y });
  }));
  candidates.sort((a, b) => cellDistance(a, cell) - cellDistance(b, cell));
  const nearest = candidates[0];
  return cellToWorld(nearest.col, nearest.row);
};
