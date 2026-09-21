import { LAKESIDE_MAP, cellToWorld } from './lakesideMap';

const grid = (width, height, fill, border = 'w') => Array.from({ length: height }, (_, y) => (
  Array.from({ length: width }, (_, x) => x === 0 || y === 0 || x === width - 1 || y === height - 1 ? border : fill)
));
const rect = (map, x, y, w, h, tile) => {
  for (let row = y; row < y + h; row += 1) for (let col = x; col < x + w; col += 1) map[row][col] = tile;
};
const freeze = (map) => map.map((row) => row.join(''));
const entry = (col, row) => cellToWorld(col, row);
const exit = (id, col, row, to, entrance, direction, zh, en) => ({ id, col, row, to, entrance, direction, label: { zh, en } });

export const STREET_SHOPS = [
  { id: 'flatbread', col: 3, row: 4, width: 9, height: 5, zh: '烧饼铺', en: 'Flatbread', accent: 0x9c5842 },
  { id: 'tea', col: 20, row: 4, width: 9, height: 5, zh: '茶饮铺', en: 'Tea House', accent: 0x4d796b },
  { id: 'noodles', col: 3, row: 12, width: 9, height: 5, zh: '面食铺', en: 'Noodles', accent: 0x987447 },
  { id: 'herbal', col: 20, row: 12, width: 9, height: 5, zh: '中药房', en: 'Herbal Pharmacy', accent: 0x496957 },
  { id: 'pastry', col: 3, row: 20, width: 9, height: 5, zh: '糕点铺', en: 'Pastries', accent: 0x9e685f },
  { id: 'snacks', col: 20, row: 20, width: 9, height: 5, zh: '小食铺', en: 'Street Snacks', accent: 0x8c5c46 },
];

const street = grid(32, 30, 'p', 'b');
STREET_SHOPS.forEach((shop) => {
  rect(street, shop.col, shop.row, shop.width, shop.height, 'b');
  rect(street, shop.col, shop.row, shop.width, 2, 'r');
});
rect(street, 16, 0, 1, 3, 'p');
rect(street, 16, 27, 1, 3, 'p');
[[13, 5], [18, 5], [13, 13], [18, 13], [13, 21], [18, 21]].forEach(([x, y]) => { street[y][x] = 'O'; });

const westRoad = grid(32, 24, 'p');
rect(westRoad, 3, 1, 5, 22, 'a');
rect(westRoad, 17, 3, 14, 19, 'g');
rect(westRoad, 17, 3, 14, 2, 'w');
rect(westRoad, 10, 0, 1, 3, 'p');
rect(westRoad, 10, 21, 1, 3, 'p');
westRoad[12][17] = 'd';
[[12, 5], [12, 19], [1, 6], [1, 17]].forEach(([x, y]) => { westRoad[y][x] = 'T'; });

const mall = grid(44, 30, 'f');
rect(mall, 0, 0, 44, 3, 'w'); // A solid north wall: no connection to the snack street.
[[11, 8], [32, 8], [11, 22], [32, 22]].forEach(([x, y]) => rect(mall, x, y, 2, 2, 'w'));
mall[15][0] = 'd'; mall[15][43] = 'd'; mall[29][22] = 'd';

const stadium = grid(36, 28, 'p');
rect(stadium, 5, 4, 26, 20, 's');
rect(stadium, 8, 7, 20, 14, 'h');
rect(stadium, 0, 15, 3, 1, 'p');
rect(stadium, 6, 1, 24, 2, 'w');
rect(stadium, 6, 25, 24, 2, 'w');

const southRoad = grid(36, 20, 'p');
rect(southRoad, 1, 8, 34, 6, 'a');
rect(southRoad, 12, 1, 18, 3, 'g');
rect(southRoad, 22, 0, 1, 5, 'p');
southRoad[0][22] = 'd';
rect(southRoad, 0, 5, 3, 1, 'p');
[[5, 3], [8, 3], [32, 3], [5, 16], [14, 16], [24, 16], [32, 16]].forEach(([x, y]) => { southRoad[y][x] = 'T'; });

export const REGION_MAPS = {
  'threshold-meadow': LAKESIDE_MAP,
  'snack-street': freeze(street),
  'mall-west-road': freeze(westRoad),
  'eastern-mall': freeze(mall),
  'outdoor-stadium': freeze(stadium),
  'mall-south-road': freeze(southRoad),
};

export const REGION_DEFINITIONS = [
  {
    id: 'threshold-meadow', regionId: 'northeast-lake', theme: 'lake',
    names: { zh: '东北湖畔', en: 'Northeast Lakeside' },
    descriptions: { zh: '湖泊位于梦境东北角。西侧被树林封住，沿南边的小路可以走到小吃街。', en: 'The lake occupies the northeast corner. Forest closes the western side; the southern path leads to the snack street.' },
    spawn: { id: 'meadow-entry', ...entry(10, 17) },
    entrances: { south: entry(10, 21) },
    portals: [exit('lake-south', 10, 23, 'snack-street', 'north', 'down', '南 · 小吃街', 'S · Snack Street')],
  },
  {
    id: 'snack-street', regionId: 'eastern-streets', theme: 'street',
    names: { zh: '小吃街', en: 'Snack Street' },
    descriptions: { zh: '灰砖、瓦檐与暖灯围着一条石板街。中药房门口守着一只蓝色小狐狸。北边回湖泊，南边通往商场西侧街道。', en: 'Grey brick, tiled eaves and warm lanterns line the stone street. A little blue fox waits outside the herbal pharmacy. North returns to the lake; south leads to the mall’s western street.' },
    spawn: { id: 'north', ...entry(16, 2) },
    entrances: { north: entry(16, 2), south: entry(16, 27) },
    portals: [exit('street-north', 16, 0, 'threshold-meadow', 'south', 'up', '北 · 东北湖畔', 'N · Lakeside'), exit('street-south', 16, 29, 'mall-west-road', 'north', 'down', '南 · 商场西侧街道', 'S · Mall West Street')],
  },
  {
    id: 'mall-west-road', regionId: 'eastern-mall-district', theme: 'west-road',
    names: { zh: '商场西侧街道', en: 'Mall West Street' },
    descriptions: { zh: '巨大的商场立在街道东侧。沿人行道到西门进入；向北返回小吃街，向南绕到商场南侧车道。商场北面没有入口。', en: 'The huge mall stands east of the road. Enter through its west doors. North returns to the snack street; south continues to the southern road. There is no northern mall entrance.' },
    spawn: { id: 'north', ...entry(10, 2) },
    entrances: { north: entry(10, 2), mall: entry(15, 12), south: entry(10, 21) },
    portals: [exit('west-north', 10, 0, 'snack-street', 'south', 'up', '北 · 小吃街', 'N · Snack Street'), exit('west-mall', 17, 12, 'eastern-mall', 'west', 'right', '商场 · 西门', 'Mall · West Entrance'), exit('west-south', 10, 23, 'mall-south-road', 'west', 'down', '南 · 南侧车道', 'S · South Road')],
  },
  {
    id: 'eastern-mall', regionId: 'eastern-mall-district', theme: 'mall',
    names: { zh: '东部商场', en: 'Eastern Mall' },
    descriptions: { zh: '这里是一片巨大的商场内部空间。室内的具体回忆尚未补全；目前可以往返西、东、南三扇门，北侧没有门。', en: 'A vast indoor mall. Its interior memories are still to be filled in. For now, the west, east and south doors are connected. The north wall has no door.' },
    spawn: { id: 'west', ...entry(2, 15) },
    entrances: { west: entry(2, 15), east: entry(41, 15), south: entry(22, 27) },
    portals: [exit('mall-west', 0, 15, 'mall-west-road', 'mall', 'left', '西门 · 街道', 'West · Street'), exit('mall-east', 43, 15, 'outdoor-stadium', 'west', 'right', '东门 · 体育场', 'East · Stadium'), exit('mall-south', 22, 29, 'mall-south-road', 'mall', 'down', '南门 · 车道', 'South · Road')],
  },
  {
    id: 'outdoor-stadium', regionId: 'eastern-mall-district', theme: 'stadium',
    names: { zh: '室外体育场', en: 'Outdoor Stadium' },
    descriptions: { zh: '商场东门外，是一片开阔的室外体育场。向西可以回到商场。', en: 'An open-air stadium lies outside the mall’s east doors. Head west to return indoors.' },
    spawn: { id: 'west', ...entry(2, 15) },
    entrances: { west: entry(2, 15) },
    portals: [exit('stadium-west', 0, 15, 'eastern-mall', 'east', 'left', '西 · 商场东门', 'W · Mall East Entrance')],
  },
  {
    id: 'mall-south-road', regionId: 'eastern-mall-district', theme: 'south-road',
    names: { zh: '商场南侧车道', en: 'Mall South Road' },
    descriptions: { zh: '车道横过商场南面。沿斑马线向北可进入商场南门，西侧人行道连接商场西侧街道。', en: 'A road runs along the south side of the mall. Follow the crossing north to its south doors; the western sidewalk leads around to the west street.' },
    spawn: { id: 'mall', ...entry(22, 2) },
    entrances: { mall: entry(22, 2), west: entry(2, 5) },
    portals: [exit('south-mall', 22, 0, 'eastern-mall', 'south', 'up', '北 · 商场南门', 'N · Mall South Entrance'), exit('south-west', 0, 5, 'mall-west-road', 'south', 'left', '西 · 西侧街道', 'W · West Street')],
  },
].map((scene) => ({ ...scene, map: REGION_MAPS[scene.id], status: 'grid-map', mapRevision: 'east-regions-1' }));

export const getRegionMap = (sceneId) => REGION_MAPS[sceneId] || LAKESIDE_MAP;
