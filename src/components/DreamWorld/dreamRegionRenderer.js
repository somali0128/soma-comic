import { renderLakesideMap } from './lakesideTiles';
import { STREET_SHOPS } from './dreamRegions';
import { TILE_SIZE, cellToWorld } from './lakesideMap';

const makeUrbanTextures = (scene) => {
  const make = (name, paint) => {
    if (scene.textures.exists(`lake-${name}`)) return;
    const g = scene.make.graphics({ x: 0, y: 0, add: false });
    const r = (x, y, w, h, color, alpha = 1) => { g.fillStyle(color, alpha); g.fillRect(x, y, w, h); };
    paint(r, g);
    g.generateTexture(`lake-${name}`, 48, 48); g.destroy();
  };
  for (let v = 0; v < 4; v += 1) {
    make(`paving-${v}`, (r) => {
      r(0, 0, 48, 48, 0x535953);
      for (let y = 0; y < 48; y += 16) for (let x = -12; x < 48; x += 24) {
        const px = x + (y % 32 ? 12 : 0);
        r(px + 1, y + 1, 22, 14, [0x8b8c7c, 0x979684, 0x858c80, 0xa29e8b][(v + y / 16) % 4]);
        r(px + 2, y + 1, 20, 1, 0xbbb6a0); r(px + 21, y + 3, 1, 11, 0x6d7468);
        r(px + 5 + v, y + 5, 7, 1, 0xa7a594); r(px + 14, y + 11, 3, 1, 0x787f71);
      }
    });
    make(`asphalt-${v}`, (r) => {
      r(0, 0, 48, 48, 0x444b50);
      for (let i = 0; i < 110; i += 1) r((i * 17 + v * 11) % 48, (i * 29 + v * 7) % 48, 1, 1, i % 2 ? 0x50575a : 0x394247);
    });
    make(`marble-${v}`, (r) => {
      r(0, 0, 48, 48, 0xb8b6aa); r(0, 0, 48, 1, 0xe0dcd0); r(0, 0, 1, 48, 0xd7d3c6);
      r(47, 0, 1, 48, 0x93998f); r(0, 47, 48, 1, 0x93998f);
      for (let i = 0; i < 18; i += 1) r((i * 7 + v * 11) % 46, (i * 13 + v * 3) % 46, 2 + i % 5, 1, i % 2 ? 0xb0b1a5 : 0xc3c0b1);
    });
    ['wall', 'brick'].forEach((type) => make(`${type}-${v}`, (r) => {
      r(0, 0, 48, 48, 0x434b48);
      for (let y = 0; y < 48; y += 8) for (let x = -12; x < 48; x += 24) {
        const px = x + (y % 16 ? 12 : 0);
        r(px + 1, y + 1, 22, 6, type === 'brick' ? 0x6d746d : 0x92978e);
        r(px + 2, y + 1, 20, 1, type === 'brick' ? 0x95988a : 0xb8b9ac);
        r(px + 3 + v, y + 4, 8, 1, type === 'brick' ? 0x626b64 : 0x818980);
      }
    }));
    make(`roof-${v}`, (r) => {
      r(0, 0, 48, 48, 0x303d3e);
      for (let y = 0; y < 48; y += 12) for (let x = 0; x < 48; x += 8) {
        r(x, y, 7, 10, 0x586765); r(x + 1, y, 2, 8, 0x82908a);
        r(x + 5, y + 1, 2, 9, 0x3d4c4b); r(x + 1, y + 9, 5, 2, 0x273736);
        r(x + 1, y + 8, 4, 1, 0x74847b);
      }
    });
    make(`glass-${v}`, (r) => {
      r(0, 0, 48, 48, 0x557279); r(3, 3, 41, 41, 0x47616c);
      r(6, 4, 4, 39, 0x68878b); r(12, 4, 1, 39, 0x85a2a0);
      for (let i = 0; i < 38; i += 1) { r(5 + i, 8 + Math.floor(i * 0.4), 2, 2, 0x7f9e9d, 0.3); }
      r(0, 0, 48, 3, 0xa0aaa3); r(0, 45, 48, 3, 0x303e43); r(45, 0, 3, 48, 0x374c54);
    });
    make(`track-${v}`, (r) => {
      r(0, 0, 48, 48, 0x975e4c);
      for (let i = 0; i < 120; i += 1) r((i * 13 + v * 11) % 48, (i * 23 + v * 17) % 48, 1, 1, i % 2 ? 0xa57057 : 0x8a5447);
    });
    make(`turf-${v}`, (r) => {
      r(0, 0, 48, 48, v % 2 ? 0x587448 : 0x527043);
      for (let i = 0; i < 160; i += 1) r((i * 17 + v * 13) % 48, (i * 31 + v) % 48, 1, 2, i % 2 ? 0x70894e : 0x48683f);
    });
    make(`door-${v}`, (r) => {
      r(0, 0, 48, 48, 0xb4b3a0); r(3, 3, 42, 42, 0x587c7c);
      r(4, 4, 19, 40, 0x709995); r(25, 4, 19, 40, 0x507575);
      r(22, 4, 3, 40, 0xc7c6ac); r(18, 21, 2, 8, 0xefe1ba); r(28, 21, 2, 8, 0xefe1ba);
      r(0, 45, 48, 3, 0xe0d1a9);
    });
  }
  make('blue-fox', (r, g) => {
    // Original little fox: curled blue tail, pointed ears, white cheek and chest.
    const polygon = (points, color) => { g.fillStyle(color); g.fillPoints(points.map(([x, y]) => ({ x, y })), true); };
    r(11, 40, 30, 4, 0x2e494c, 0.35);
    polygon([[28, 36], [34, 21], [42, 17], [45, 23], [42, 35], [36, 41], [23, 40]], 0x346aab);
    polygon([[37, 23], [42, 17], [45, 23], [42, 29], [39, 27]], 0xb2e5ed);
    polygon([[15, 24], [26, 24], [33, 37], [28, 42], [13, 41], [10, 35]], 0x5aa6ce);
    r(14, 29, 5, 10, 0x84c6df); r(16, 38, 5, 5, 0xb8e5e7); r(25, 38, 5, 5, 0x3c6ea2);
    polygon([[10, 21], [9, 6], [17, 13], [25, 13], [32, 5], [33, 23], [23, 31], [16, 28]], 0x447fb9);
    polygon([[11, 9], [15, 16], [11, 19]], 0xadc6db); polygon([[30, 9], [27, 17], [31, 19]], 0x9fb4cf);
    polygon([[11, 22], [19, 24], [23, 30], [16, 28]], 0xd5eff0); polygon([[31, 22], [25, 24], [23, 30], [28, 28]], 0xbfe5e9);
    r(14, 20, 3, 2, 0x20384e); r(27, 20, 3, 2, 0x20384e); r(14, 20, 1, 1, 0xeffcff);
    r(22, 26, 3, 2, 0x21384d); r(18, 14, 7, 2, 0x77b8d7); r(15, 17, 3, 1, 0x87c8de);
  });
};

export const renderDreamRegion = (scene, config, language = 'zh') => {
  makeUrbanTextures(scene);
  renderLakesideMap(scene, config.map);
  const g = scene.add.graphics().setDepth(3);
  const r = (x, y, w, h, color, alpha = 1) => { g.fillStyle(color, alpha); g.fillRect(x, y, w, h); };
  const text = (x, y, value, options = {}) => scene.add.text(x, y, value, {
    fontFamily: 'system-ui, sans-serif', fontSize: '18px', color: '#e4d6ad',
    fontStyle: 'bold', align: 'center', ...options,
  }).setOrigin(0.5).setDepth(5);
  const lantern = (x, y) => {
    scene.add.circle(x, y, 24, 0xffbd64, 0.07).setDepth(4);
    r(x - 1, y - 18, 2, 8, 0x5d4938); r(x - 8, y - 10, 16, 21, 0x983f31);
    r(x - 6, y - 8, 12, 17, 0xca6f42); r(x - 3, y - 8, 2, 17, 0xeab574);
    r(x - 8, y - 11, 16, 2, 0x413b2e); r(x - 5, y + 11, 10, 2, 0x443929);
    r(x - 1, y + 13, 2, 8, 0xd3a05a);
  };

  if (config.theme === 'street') {
    STREET_SHOPS.forEach((shop) => {
      const x = shop.col * 48; const y = shop.row * 48; const w = shop.width * 48;
      // Grey tiled eaves, timber-framed windows and recessed storefronts.
      r(x - 4, y + 90, w + 8, 8, 0x293733); r(x - 8, y + 87, w + 16, 3, 0x9aa18a);
      r(x + 8, y + 101, 9, 136, 0x534334); r(x + w - 17, y + 101, 9, 136, 0x534334);
      r(x + 19, y + 151, w - 38, 75, 0x4b3d30);
      for (let wx = x + 25; wx < x + w - 45; wx += 58) {
        r(wx, y + 159, 48, 59, 0x997a4e); r(wx + 3, y + 162, 42, 51, 0xb49b69);
        for (let bar = 0; bar < 4; bar += 1) r(wx + 4 + bar * 12, y + 160, 3, 56, 0x594b35);
        r(wx + 2, y + 178, 44, 3, 0x655039); r(wx + 2, y + 199, 44, 3, 0x655039);
      }
      r(x + w / 2 - 26, y + 152, 52, 85, 0x292e27);
      r(x + w / 2 - 22, y + 155, 20, 78, 0x554b36); r(x + w / 2 + 2, y + 155, 20, 78, 0x3f3c2e);
      r(x + w / 2 - 48, y + 230, 96, 8, 0xa4a18a);
      r(x + 48, y + 111, w - 96, 35, 0x322f28); r(x + 50, y + 113, w - 100, 31, shop.accent);
      text(x + w / 2, y + 128, shop[language] || shop.zh, { fontSize: language === 'zh' ? '23px' : '18px', color: '#f1dca5' });
      lantern(x + 28, y + 143); lantern(x + w - 28, y + 143);
      if (shop.id === 'herbal') {
        // Herb drawer handles and hanging bundles, without inventing an interior.
        for (let i = 0; i < 5; i += 1) { r(x + 40 + i * 16, y + 213, 12, 10, 0x775e3f); r(x + 45 + i * 16, y + 217, 3, 1, 0xcfbc8b); }
        text(x + w / 2, y + 200, language === 'zh' ? '药' : 'HERBS', { fontSize: '17px', color: '#c6b181' });
      }
    });
    text(16 * 48 + 24, 3 * 48, language === 'zh' ? '小 吃 街' : 'SNACK STREET', { color: '#e8d6a7', backgroundColor: '#37493ee8', padding: { x: 20, y: 10 } });
    // Paired warm lamps run along the central pedestrian lane.
    [9, 17, 25].forEach((row) => { lantern(14 * 48, row * 48 + 15); lantern(18 * 48 + 24, row * 48 + 15); });
  }
  if (config.theme === 'west-road') {
    for (let y = 48; y < 23 * 48; y += 96) r(5 * 48 + 22, y, 4, 45, 0xc5b784);
    r(8 * 48, 48, 5, 22 * 48, 0xa2a595);
    for (let x = 3 * 48; x < 8 * 48; x += 28) r(x, 12 * 48, 15, 48, 0xc9cab8);
    r(17 * 48, 5 * 48, 14 * 48, 14, 0xc4c6b5);
    text(24 * 48, 4 * 48, language === 'zh' ? '东 部 商 场' : 'EASTERN MALL', { fontSize: '30px', color: '#e9e2c7' });
    r(17 * 48, 11 * 48, 48, 7, 0xd9cc99);
  }
  if (config.theme === 'mall') {
    // Only architectural shell and entrances; no imagined shops or interior story.
    text(22 * 48, 5 * 48, language === 'zh' ? '东 部 商 场' : 'EASTERN MALL', { fontSize: '32px', color: '#626f68' });
    text(22 * 48, 6 * 48, language === 'zh' ? '室内回忆 · 待补全' : 'Interior memories · to be recalled', { fontSize: '18px', color: '#7b8378' });
    r(4 * 48, 14 * 48, 36 * 48, 4, 0x929e8f); r(4 * 48, 17 * 48, 36 * 48, 4, 0x929e8f);
    r(21 * 48, 17 * 48, 4, 11 * 48, 0x929e8f); r(24 * 48, 17 * 48, 4, 11 * 48, 0x929e8f);
    text(8 * 48, 15 * 48 + 24, language === 'zh' ? '← 西门 · 街道' : '← WEST · STREET', { color: '#5d736e' });
    text(36 * 48, 15 * 48 + 24, language === 'zh' ? '东门 · 体育场 →' : 'EAST · STADIUM →', { color: '#5d736e' });
    text(22 * 48 + 24, 24 * 48, language === 'zh' ? '↓ 南门 · 车道' : '↓ SOUTH · ROAD', { color: '#5d736e' });
  }
  if (config.theme === 'stadium') {
    g.lineStyle(2, 0xe4d5b9, 0.9);
    for (let i = 0; i < 3; i += 1) g.strokeRoundedRect((5 * 48) + 10 + i * 17, (4 * 48) + 10 + i * 17, 26 * 48 - 20 - i * 34, 20 * 48 - 20 - i * 34, 85);
    g.lineStyle(3, 0xc9d4a9, 0.9); g.strokeRect(9 * 48, 8 * 48, 18 * 48, 12 * 48);
    g.lineBetween(18 * 48, 8 * 48, 18 * 48, 20 * 48); g.strokeCircle(18 * 48, 14 * 48, 70);
    g.strokeRect(9 * 48, 11 * 48, 2 * 48, 6 * 48); g.strokeRect(25 * 48, 11 * 48, 2 * 48, 6 * 48);
    text(18 * 48, 2 * 48, language === 'zh' ? '室 外 体 育 场' : 'OUTDOOR STADIUM', { color: '#e2dcc6' });
  }
  if (config.theme === 'south-road') {
    for (let x = 48; x < 35 * 48; x += 96) r(x, 11 * 48 - 2, 48, 4, 0xd4c394);
    r(48, 8 * 48, 34 * 48, 4, 0xb2b4a3); r(48, 14 * 48 - 4, 34 * 48, 4, 0xb2b4a3);
    for (let y = 8 * 48 + 10; y < 14 * 48; y += 28) r(21 * 48, y, 3 * 48, 14, 0xcdd0bd);
    text(22 * 48 + 24, 5 * 48, language === 'zh' ? '↑ 商场南门' : '↑ MALL SOUTH ENTRANCE', { color: '#515f56' });
  }

  config.portals.forEach((portal) => {
    const { x, y } = cellToWorld(portal.col, portal.row);
    scene.add.rectangle(x, y, 38, 38, 0xbed6b4, 0.16).setStrokeStyle(2, 0xd2dab2, 0.7).setDepth(4);
    const arrow = { up: '↑', down: '↓', left: '←', right: '→' }[portal.direction];
    const nearLeft = portal.col === 0; const nearRight = portal.col === config.map[0].length - 1;
    const labelX = nearLeft ? x + 100 : nearRight ? x - 110 : x;
    const labelY = portal.row === 0 ? y + 42 : y - 36;
    text(labelX, labelY, portal.label[language] || portal.label.zh, { fontSize: '15px', backgroundColor: '#203a39ee', padding: { x: 8, y: 5 } }).setDepth(3000);
    text(x, y, arrow, { fontSize: '26px', color: '#edf1ce' }).setDepth(4);
  });
};
