import { LAKESIDE_MAP, TILE_SIZE, TILE_TYPES, tileAt } from './lakesideMap';

// Original, deterministic 48px pixel-art tiles. Shared textures have no baked-in
// grid border; only terrain transitions receive an edge. Props use a second layer.
const SIZE = 48;
const randomFrom = (seed) => () => {
  seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
  return seed / 4294967296;
};
const grassColors = [0x334c36, 0x3c583b, 0x466140, 0x506b44, 0x597449, 0x647d50];
const leafColors = [0x1c3328, 0x263f2c, 0x305035, 0x3e613b, 0x507344, 0x68864f, 0x859e64];

export const createLakesideTextures = (scene) => {
  const make = (name, width, height, seed, paint) => {
    const key = `lake-${name}`;
    if (scene.textures.exists(key)) return;
    const g = scene.make.graphics({ x: 0, y: 0, add: false });
    const rand = randomFrom(seed);
    const r = (x, y, w, h, color, alpha = 1) => {
      g.fillStyle(color, alpha);
      g.fillRect(Math.floor(x), Math.floor(y), Math.max(1, Math.floor(w)), Math.max(1, Math.floor(h)));
    };
    const oval = (cx, cy, rx, ry, color, alpha = 1) => {
      for (let y = -ry; y <= ry; y += 1) {
        const half = Math.floor(rx * Math.sqrt(Math.max(0, 1 - y * y / (ry * ry))));
        r(cx - half, cy + y, half * 2 + 1, 1, color, alpha);
      }
    };
    const poly = (points, color) => {
      g.fillStyle(color, 1);
      g.fillPoints(points.map(([x, y]) => ({ x: Math.round(x), y: Math.round(y) })), true);
    };
    paint({ r, oval, poly, rand });
    g.generateTexture(key, width, height);
    g.destroy();
  };
  const grass = ({ r, rand }) => {
    r(0, 0, SIZE, SIZE, 0x425d3e);
    for (let i = 0; i < 330; i += 1) {
      const x = rand() * SIZE; const y = rand() * SIZE;
      r(x, y, 1 + rand() * 3, 1, grassColors[Math.floor(rand() * grassColors.length)]);
      if (i % 5 === 0) r(x, y - 2, 1, 2, 0x66804c);
    }
  };
  const stone = ({ r, poly, rand }, x, y, w, h, shade = 0) => {
    const colors = [0x899080, 0x9b9b88, 0x818b81, 0xaba591, 0x94998c];
    const color = colors[shade % colors.length];
    poly([[x + 3, y], [x + w - 3, y], [x + w, y + 3], [x + w - 1, y + h - 3],
      [x + w - 4, y + h], [x + 2, y + h - 1], [x, y + h - 4], [x, y + 3]], 0x414b43);
    poly([[x + 3, y + 1], [x + w - 4, y + 1], [x + w - 2, y + 3], [x + w - 3, y + h - 4],
      [x + 3, y + h - 3], [x + 1, y + h - 5], [x + 1, y + 3]], color);
    r(x + 3, y + 1, w - 7, 1, 0xc2bfa6);
    r(x + 1, y + 3, 1, h - 8, 0xb1b29e);
    for (let i = 0; i < 8; i += 1) r(x + 3 + rand() * (w - 7), y + 3 + rand() * (h - 7), 1, 1, i % 2 ? 0x747c70 : 0xb2b3a0);
  };

  for (let v = 0; v < 4; v += 1) {
    ['grass', 'grass-tuft', 'flowers'].forEach((name) => make(`${name}-${v}`, SIZE, SIZE, 47 + v * 127, (p) => {
      grass(p);
      const { r, rand } = p;
      if (name === 'grass-tuft') {
        for (let i = 0; i < 10; i += 1) {
          const x = 5 + rand() * 36; const y = 8 + rand() * 34;
          r(x - 3, y, 7, 2, 0x304b33);
          r(x, y - 6, 1, 7, 0x8b9b5c); r(x - 2, y - 4, 1, 5, 0x658342);
          r(x + 2, y - 3, 1, 4, 0x7d9653); r(x - 3, y - 5, 1, 2, 0x526e3c);
        }
      }
      if (name === 'flowers') {
        for (let i = 0; i < 8; i += 1) {
          const x = 5 + rand() * 36; const y = 6 + rand() * 34;
          r(x, y, 1, 7, 0x809c58); r(x - 2, y + 4, 2, 1, 0x9fac67);
          const petal = [0xc7b6cb, 0x9baed1, 0xe1d9b4][i % 3];
          r(x - 2, y - 1, 5, 2, 0x4a554c); r(x - 1, y - 2, 3, 4, petal);
          r(x - 2, y - 1, 5, 2, petal); r(x, y - 1, 1, 1, 0xefcd81);
        }
      }
    }));
    make(`path-${v}`, SIZE, SIZE, 90 + v * 93, (p) => {
      p.r(0, 0, SIZE, SIZE, 0x505c47);
      for (let row = -1; row < 4; row += 1) {
        for (let col = -1; col < 4; col += 1) {
          const x = col * 18 + (row % 2 ? 9 : 0); const y = row * 16;
          stone(p, x, y, 17, 15, Math.floor(p.rand() * 5));
        }
      }
      for (let i = 0; i < 12; i += 1) p.r(p.rand() * 48, p.rand() * 48, 2, 1, 0x5b7144);
    });
    make(`sand-${v}`, SIZE, SIZE, 240 + v * 79, (p) => {
      p.r(0, 0, SIZE, SIZE, 0x777d62);
      for (let i = 0; i < 260; i += 1) p.r(p.rand() * 48, p.rand() * 48, 1 + p.rand() * 2, 1, [0x6b755c, 0x8c9071, 0x99987c, 0x64715a][i % 4]);
      for (let i = 0; i < 4; i += 1) stone(p, 3 + p.rand() * 31, 3 + p.rand() * 31, 8 + p.rand() * 7, 8 + p.rand() * 6, i + v);
    });
    for (let frame = 0; frame < 4; frame += 1) {
      make(`water-${v}-${frame}`, SIZE, SIZE, 180 + v * 87, ({ r, rand }) => {
        r(0, 0, SIZE, SIZE, 0x284b57);
        for (let i = 0; i < 85; i += 1) {
          const x = Math.floor(rand() * 48); const y = Math.floor(rand() * 48);
          const length = 2 + rand() * 8;
          r((x + frame * (i % 2 ? 1 : -1) + 48) % 48, y, length, 1,
            [0x2b505c, 0x305863, 0x254651, 0x355e67, 0x264954][i % 5]);
        }
        for (let i = 0; i < 3; i += 1) {
          const x = 5 + rand() * 24; const y = 5 + rand() * 35;
          r(x + frame, y, 6 + rand() * 8, 1, 0x567b80);
          r(x + 3 + frame, y + 1, 5, 1, 0x3b6470);
        }
      });
    }
    make(`dock-${v}`, SIZE, SIZE, 450 + v * 51, ({ r, oval, rand }) => {
      r(0, 0, 48, 48, 0x3c3b32);
      for (let y = 0; y < 48; y += 8) {
        r(0, y, 48, 7, 0x8a795b); r(0, y, 48, 1, 0xb7a27b); r(0, y + 6, 48, 1, 0x5d5543);
        for (let i = 0; i < 10; i += 1) r(rand() * 42, y + 2 + rand() * 3, 3 + rand() * 10, 1, i % 2 ? 0x76694f : 0xa08b65);
        const joint = 7 + Math.floor(rand() * 32); r(joint, y, 1, 7, 0x514936);
        r(3, y + 2, 2, 2, 0x414339); r(44, y + 2, 2, 2, 0x414339);
        r(3, y + 2, 1, 1, 0xc5b798); r(44, y + 2, 1, 1, 0xc5b798);
        if (y % 16 === 0) { oval(24, y + 3, 4, 1, 0x635840); r(23, y + 3, 2, 1, 0x413f31); }
      }
    });
  }

  for (let v = 0; v < 3; v += 1) {
    make(`tree-${v}`, 80, 100, 991 + v * 543, ({ r, oval, rand }) => {
      oval(43, 91, 29, 7, 0x122c26, 0.35);
      r(35, 54, 11, 37, 0x413d2c); r(36, 56, 3, 32, 0x827251);
      r(40, 55, 2, 35, 0x635237); r(44, 62, 2, 28, 0x302f26);
      r(31, 88, 8, 3, 0x55482e); r(43, 87, 8, 3, 0x39392a);
      for (let i = 0; i < 20; i += 1) r(36 + rand() * 8, 64 + rand() * 25, 1, 2 + rand() * 4, 0x3b3729);
      const lobes = [[39, 23, 20, 19], [23, 39, 19, 20], [55, 37, 20, 22], [39, 51, 25, 23], [23, 59, 18, 15], [57, 57, 17, 17]];
      lobes.forEach(([cx, cy, rx, ry]) => {
        oval(cx + 1, cy + 3, rx + 1, ry + 1, leafColors[0]);
        oval(cx, cy, rx, ry, leafColors[2]);
        oval(cx - 3, cy - 4, rx - 3, ry - 4, leafColors[3]);
        for (let i = 0; i < 180; i += 1) {
          const x = Math.floor(cx + (rand() * 2 - 1) * rx);
          const y = Math.floor(cy + (rand() * 2 - 1) * ry);
          if (((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 > 0.89) continue;
          const lit = (cx - x + cy - y) / 30;
          const shade = Math.max(1, Math.min(6, Math.floor(2.8 + lit + rand() * 2.5)));
          r(x, y, 2 + rand() * 3, 1 + rand() * 2, leafColors[shade]);
          if (i % 3 === 0) r(x + 1, y - 1, 2, 1, leafColors[Math.min(6, shade + 1)]);
        }
      });
    });
    make(`rock-${v}`, SIZE, SIZE, 823 + v * 151, (p) => {
      p.oval(25, 37, 20, 6, 0x233e30, 0.45);
      stone(p, 7, 12, 33, 28, v); stone(p, 4, 28, 14, 13, v + 1);
      p.poly([[11, 16], [20, 10], [34, 14], [28, 24], [10, 27]], 0xa5a996);
      p.r(13, 17, 10, 1, 0xc1c3ab); p.r(30, 24, 1, 10, 0x606d62);
      for (let i = 0; i < 20; i += 1) p.r(8 + p.rand() * 28, 32 + p.rand() * 6, 2, 1, [0x577043, 0x758754, 0x425b3b][i % 3]);
    });
  }
};

export const renderLakesideMap = (scene, map = LAKESIDE_MAP) => {
  createLakesideTextures(scene);
  const water = [];
  map.forEach((row, y) => [...row].forEach((code, x) => {
    const variant = (x * 17 + y * 31 + (x * y) % 7) % 4;
    const terrain = code === 'T' || code === 'O' ? 'grass' : TILE_TYPES[code].texture;
    const key = code === '~' ? `water-${variant}-0` : `${terrain}-${variant}`;
    const tile = scene.add.image(x * TILE_SIZE, y * TILE_SIZE, `lake-${key}`).setOrigin(0).setDepth(0);
    if (code === '~') water.push({ tile, variant });
    if (code === 'T') {
      scene.add.image(x * TILE_SIZE + 24, y * TILE_SIZE + 38, `lake-tree-${(x + y) % 3}`)
        .setOrigin(0.5, 0.92).setDepth(y * TILE_SIZE + 38);
    }
    if (code === 'O') scene.add.image(x * TILE_SIZE, y * TILE_SIZE, `lake-rock-${(x + y) % 3}`).setOrigin(0).setDepth(y * TILE_SIZE + 30);
  }));

  const edge = scene.add.graphics().setDepth(2);
  const pixel = (x, y, w, h, color, alpha = 1) => { edge.fillStyle(color, alpha); edge.fillRect(x, y, w, h); };
  const directions = [[0, -1], [1, 0], [0, 1], [-1, 0]];
  map.forEach((row, y) => [...row].forEach((code, x) => {
    const rand = randomFrom(x * 177 + y * 919 + 32);
    if (code === '~') {
      directions.forEach(([dx, dy]) => {
        if (['~', '#'].includes(tileAt(x + dx, y + dy, map))) return;
        for (let t = 0; t < 48; t += 2) {
          const inset = Math.floor(rand() * 3);
          const px = x * 48 + (dx === -1 ? inset : dx === 1 ? 47 - inset : t);
          const py = y * 48 + (dy === -1 ? inset : dy === 1 ? 47 - inset : t);
          pixel(px, py, dx ? 3 : 2, dy ? 3 : 2, 0x1b3c42);
          pixel(px - dx * 3, py - dy * 3, dx ? 2 : 3, dy ? 2 : 3, 0x8faaa0, 0.65);
          if (t % 8 === 0) pixel(px - dx * 7, py - dy * 7, dx ? 1 : 4, dy ? 1 : 4, 0x547b79);
        }
      });
    }
    if (code === ':' || code === '=') {
      directions.forEach(([dx, dy]) => {
        if (!['.', ',', '*', 'T', 'O'].includes(tileAt(x + dx, y + dy, map))) return;
        for (let t = 0; t < 48; t += 2) {
          const depth = 2 + Math.floor(rand() * 5);
          const px = x * 48 + (dx === -1 ? 0 : dx === 1 ? 48 - depth : t);
          const py = y * 48 + (dy === -1 ? 0 : dy === 1 ? 48 - depth : t);
          pixel(px, py, dx ? depth : 2, dy ? depth : 2, grassColors[Math.floor(rand() * grassColors.length)]);
        }
      });
    }
    if (code === '#') {
      if (tileAt(x, y - 1, map) !== '#') {
        pixel(x * 48, y * 48, 48, 3, 0xc0ac84);
        pixel(x * 48 + 3, y * 48 - 5, 5, 10, 0x514c3b);
        pixel(x * 48 + 3, y * 48 - 5, 5, 2, 0xc8b68b);
      }
      if (tileAt(x, y + 1, map) !== '#') {
        pixel(x * 48, y * 48 + 46, 48, 3, 0x423e32);
        pixel(x * 48 + 3, y * 48 + 42, 5, 9, 0x514c3b);
        pixel(x * 48 + 3, y * 48 + 42, 5, 2, 0xc8b68b);
      }
    }
  }));
  let frame = 0;
  scene.time.addEvent({ delay: 650, loop: true, callback: () => {
    frame = (frame + 1) % 4;
    water.forEach(({ tile, variant }) => tile.setTexture(`lake-water-${variant}-${frame}`));
  } });
};

