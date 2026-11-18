/**
 * Sticky-note renderer for VTube Studio item images.
 *
 * Style: hand-drawn cartoon paper — a slightly warped sheet with a wobbly
 * dark outline, soft inner shading, faint wavy rule lines and cartoon tape /
 * pin / paperclip. The text is laid out flat, then mapped glyph by glyph onto
 * the same warp as the paper, so it bends with the sheet.
 *
 * Framework-free: it only needs a <canvas> (or OffscreenCanvas) and an options
 * object, so it can be reused outside this page (e.g. a future VTS plugin).
 * The same options always produce the same pixels — every bit of randomness
 * (paper shape, outline wobble, grain) comes from `seed`.
 *
 * Fonts are NOT loaded here. Load the font for the text first
 * (see stickyNoteFonts.js), then call renderStickyNote.
 *
 * Geometry uses "paper units": the paper's short side is always 100 units.
 * Font sizes are in the same units, so they scale with the paper.
 */

export const PAPER_PRESETS = {
  cream: { label: '奶油', color: '#fff0d0' },
  yellow: { label: '柠檬黄', color: '#fff3a3' },
  pink: { label: '粉色', color: '#ffd9e2' },
  blue: { label: '蓝色', color: '#d6ecf8' },
  green: { label: '绿色', color: '#dcf2c9' },
  notebook: { label: '横线本', color: '#fffdf6' },
  kraft: { label: '牛皮纸', color: '#dcb685' },
  custom: { label: '自定义', color: null },
};

export const TAPE_COLORS = {
  blue: { label: '雾蓝', fill: [198, 218, 222], line: '#3f5867' },
  pink: { label: '樱粉', fill: [243, 200, 210], line: '#7b4453' },
  yellow: { label: '奶黄', fill: [244, 226, 160], line: '#6f5a22' },
  mint: { label: '薄荷', fill: [200, 232, 212], line: '#3c6450' },
};

export const SHAPES = {
  square: { label: '方形', width: 100, height: 100 },
  landscape: { label: '横向长条', width: 200, height: 100 },
  portrait: { label: '竖向', width: 100, height: 135 },
};

export const DECORATIONS = ['none', 'tape', 'pin', 'clip'];
export const ALIGNMENTS = ['left', 'center', 'right'];

export const MAX_ROTATION = 15;
export const FONT_SIZE_LIMITS = { min: 7, max: 46 };
export const LINE_HEIGHT = 1.28;

export const DEFAULT_OPTIONS = {
  text: '今天也要\n好好吃饭！',
  fontFamily: 'Long Cang',
  fontWeight: 400,
  fontSizeMode: 'auto',
  fontSize: 24,
  minFontSize: FONT_SIZE_LIMITS.min,
  maxFontSize: FONT_SIZE_LIMITS.max,
  align: 'center',
  textColor: '#4a3418',
  paper: 'cream',
  customColor: '#ffe3c2',
  shape: 'square',
  decoration: 'tape',
  tapeColor: 'blue',
  warp: 0.8,
  lines: true,
  shadow: true,
  curl: false,
  noise: false,
  rotation: 0,
  size: 768,
  pixelRatio: 1,
  seed: 7,
};

const FALLBACK_FONTS = '"PingFang SC", "Hiragino Sans GB", "Noto Sans SC", "Microsoft YaHei", sans-serif';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const toRad = (deg) => (deg * Math.PI) / 180;

/* ------------------------------------------------------------------ */
/* Text layout (pure, testable with a fake measure function)           */
/* ------------------------------------------------------------------ */

// Han, kana, hangul and full-width forms: one breakable unit per character.
const CJK_RE = /[⺀-⿿　-〿぀-ヿ㄀-ㇿ㐀-䶿一-鿿가-힯豈-﫿︰-﹏＀-￯]/;
// Must not start a line (stick to the previous unit).
const NO_LINE_START = new Set('，。、；：！？）】》」』〉”’…—～·%,.;:!?)]}>\'"'.split(''));
// Must not end a line (stick to the next unit).
const NO_LINE_END = new Set('（【《「『〈“‘([{<'.split(''));

/** Split one paragraph into unbreakable tokens: CJK chars, latin words, spaces. */
export function tokenize(paragraph) {
  const raw = [];
  let word = '';
  const flushWord = () => {
    if (word) raw.push(word);
    word = '';
  };

  for (const ch of Array.from(paragraph)) {
    if (ch === ' ' || ch === '\t') {
      flushWord();
      raw.push(' ');
    } else if (CJK_RE.test(ch) || (ch.charCodeAt(0) > 127 && (NO_LINE_START.has(ch) || NO_LINE_END.has(ch)))) {
      // ASCII punctuation stays inside its word ("don't", "hi!"); full-width
      // punctuation becomes its own token and is glued to a neighbour below.
      flushWord();
      raw.push(ch);
    } else {
      word += ch;
    }
  }
  flushWord();

  // Keep punctuation glued to its neighbour so it never starts/ends a line badly.
  const tokens = [];
  let pendingOpen = '';
  for (const token of raw) {
    if (token !== ' ' && NO_LINE_END.has(token)) {
      pendingOpen += token;
      continue;
    }
    if (token !== ' ' && NO_LINE_START.has(token) && tokens.length && tokens[tokens.length - 1] !== ' ' && !pendingOpen) {
      tokens[tokens.length - 1] += token;
      continue;
    }
    tokens.push(pendingOpen + token);
    pendingOpen = '';
  }
  if (pendingOpen) tokens.push(pendingOpen);
  return tokens;
}

/** Break a token that is wider than the line on its own, character by character. */
function splitLongToken(token, maxWidth, measure) {
  const parts = [];
  let current = '';
  for (const ch of Array.from(token)) {
    if (current && measure(current + ch) > maxWidth) {
      parts.push(current);
      current = ch;
    } else {
      current += ch;
    }
  }
  if (current) parts.push(current);
  return parts;
}

/**
 * Wrap text into lines that fit maxWidth.
 * - Manual line breaks are kept.
 * - Chinese breaks between characters, English between words.
 * - Opening/closing punctuation never dangles at the wrong end of a line.
 */
export function wrapText(text, maxWidth, measure) {
  const lines = [];
  const paragraphs = String(text ?? '').replace(/\r\n?/g, '\n').split('\n');

  for (const paragraph of paragraphs) {
    const tokens = tokenize(paragraph);
    if (!tokens.length) {
      lines.push('');
      continue;
    }

    let line = '';
    const pushLine = () => {
      lines.push(line.replace(/\s+$/, ''));
      line = '';
    };

    for (const token of tokens) {
      if (token === ' ') {
        if (line && measure(line + ' ') <= maxWidth) line += ' ';
        else if (line) pushLine();
        continue;
      }
      if (!line || measure(line + token) <= maxWidth) {
        if (!line && measure(token) > maxWidth) {
          const parts = splitLongToken(token, maxWidth, measure);
          parts.slice(0, -1).forEach((part) => lines.push(part));
          line = parts[parts.length - 1];
        } else {
          line += token;
        }
        continue;
      }
      pushLine();
      if (measure(token) > maxWidth) {
        const parts = splitLongToken(token, maxWidth, measure);
        parts.slice(0, -1).forEach((part) => lines.push(part));
        line = parts[parts.length - 1];
      } else {
        line = token;
      }
    }
    pushLine();
  }

  // Drop trailing empty lines so they don't shrink the auto font size.
  while (lines.length > 1 && lines[lines.length - 1] === '') lines.pop();
  return lines;
}

/**
 * Find the largest font size (within limits) whose wrapped text fits the box.
 * measureAt(size) must return a measure(str) function for that size.
 */
export function fitText(text, box, measureAt, { min, max, lineHeight = LINE_HEIGHT, keepLinesRatio = 0.75 }) {
  const manualLines = wrapText(text, Infinity, () => 0).length;
  const layoutAt = (size) => {
    const measure = measureAt(size);
    const lines = wrapText(text, box.width, measure);
    const height = lines.length * size * lineHeight;
    const widest = Math.max(0, ...lines.map((line) => measure(line)));
    const fits = height <= box.height && widest <= box.width + 0.01;
    return { size, lines, fits, intact: fits && lines.length === manualLines };
  };

  // Largest size (binary search) for which `accept` holds.
  const largest = (accept) => {
    const atMax = layoutAt(max);
    if (accept(atMax)) return atMax;
    let best = layoutAt(min);
    if (!accept(best)) return null;
    let lo = min;
    let hi = max;
    for (let i = 0; i < 18 && hi - lo > 0.25; i += 1) {
      const mid = (lo + hi) / 2;
      const attempt = layoutAt(mid);
      if (accept(attempt)) {
        best = attempt;
        lo = mid;
      } else {
        hi = mid;
      }
    }
    return best;
  };

  const biggest = largest((layout) => layout.fits);
  if (!biggest) return { ...layoutAt(min), overflow: true };

  // Prefer keeping the user's own line breaks intact (no "好好吃 / 饭！")
  // as long as that doesn't shrink the text too much.
  if (!biggest.intact) {
    const intact = largest((layout) => layout.intact);
    if (intact && intact.size >= biggest.size * keepLinesRatio) {
      return { size: intact.size, lines: intact.lines, overflow: false };
    }
  }
  return { size: biggest.size, lines: biggest.lines, overflow: false };
}

/* ------------------------------------------------------------------ */
/* Geometry                                                            */
/* ------------------------------------------------------------------ */

/** Text box inside the (flat, un-warped) paper, in paper-centred units. */
export function getTextBox(options, layout) {
  const w = layout.paperWidth;
  const h = layout.paperHeight;
  const inset = 13;
  let left = -w / 2 + inset;
  const right = w / 2 - inset;
  let top = -h / 2 + inset;
  const bottom = h / 2 - inset - (options.curl ? 3 : 0);
  if (options.paper === 'notebook') left = -w / 2 + 21;
  if (options.decoration === 'tape') top += 9;
  if (options.decoration === 'clip') top += 6;
  if (options.decoration === 'pin') top += 8;
  return { x: left, y: top, width: right - left, height: bottom - top };
}

/* ------------------------------------------------------------------ */
/* Colour + randomness helpers                                         */
/* ------------------------------------------------------------------ */

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hexToRgb(hex) {
  const value = /^#?([0-9a-f]{6})$/i.exec(hex || '');
  if (!value) return [255, 240, 208];
  const n = parseInt(value[1], 16);
  return [n >> 16, (n >> 8) & 255, n & 255];
}

const mixRgb = (a, b, t) => a.map((c, i) => Math.round(c + (b[i] - c) * t));
const rgba = ([r, g, b], alpha = 1) => `rgba(${r}, ${g}, ${b}, ${alpha})`;

function paperRgb(options) {
  if (options.paper === 'custom') return hexToRgb(options.customColor || DEFAULT_OPTIONS.customColor);
  return hexToRgb((PAPER_PRESETS[options.paper] || PAPER_PRESETS.cream).color);
}

/** Hand-drawn outline colour: a darkened paper tone pulled toward warm brown. */
function outlineRgb(base) {
  return mixRgb(mixRgb(base, [0, 0, 0], 0.58), [92, 66, 30], 0.5);
}

/* ------------------------------------------------------------------ */
/* Paper warp                                                          */
/* ------------------------------------------------------------------ */

/**
 * Returns P(u, v) -> {x, y}: maps the flat sheet (u, v in 0..1) onto a gently
 * warped one — skewed corners, bowed edges and a soft wave through the middle.
 * warp = 0 gives the exact rectangle.
 */
export function createPaperWarp(width, height, { warp = 0.7, seed = 7 } = {}) {
  const k = clamp(Number(warp) || 0, 0, 1);
  const rand = mulberry32((Number(seed) || 0) * 7919 + 17);
  const r = () => rand() * 2 - 1;
  const phase = () => rand() * Math.PI * 2;

  const corners = {
    // Measured from the reference sketch: the sheet is sheared (top pushed
    // right, bottom pulled left) and the bottom-left corner is lifted.
    tl: [-width / 2 + (12 + r() * 2.5) * k, -height / 2 + (-2 + r() * 2) * k],
    tr: [width / 2 + (8 + r() * 2.5) * k, -height / 2 + (7 + r() * 2.5) * k],
    br: [width / 2 + (-6 + r() * 2.5) * k, height / 2 + (4 + r() * 2.5) * k],
    bl: [-width / 2 + (-14 + r() * 2.5) * k, height / 2 + (-9 + r() * 3) * k],
  };
  const [p1, p2, p3, p4, p5] = [phase(), phase(), phase(), phase(), phase()];
  const S = Math.sin;
  const PI = Math.PI;

  return (u, v) => {
    const topX = corners.tl[0] + (corners.tr[0] - corners.tl[0]) * u;
    const topY = corners.tl[1] + (corners.tr[1] - corners.tl[1]) * u;
    const botX = corners.bl[0] + (corners.br[0] - corners.bl[0]) * u;
    const botY = corners.bl[1] + (corners.br[1] - corners.bl[1]) * u;
    let x = topX + (botX - topX) * v;
    let y = topY + (botY - topY) * v;
    if (k) {
      // Harmonics are offset so each edge still ends exactly at its corners.
      const h2 = (t, ph) => S(2 * PI * t + ph) - S(ph) * (1 - t) - S(2 * PI + ph) * t;
      const bowTop = k * (-1.5 * S(PI * u) + 0.6 * h2(u, p1));
      const bowBottom = k * (2.5 * S(PI * u) + 1.2 * h2(u, p2));
      const bowLeft = k * (-3 * S(PI * v) + 1.2 * h2(v, p3));
      const bowRight = k * (2.5 * S(PI * v) - 1 * h2(v, p4));
      const wave = k * 1.2 * S(2 * PI * u * 1.1 + p5 + v * 3) * S(PI * v);
      x += bowLeft * (1 - u) + bowRight * u;
      y += bowTop * (1 - v) + bowBottom * v + wave;
    }
    return { x, y };
  };
}

const CURL_UNITS = 15;

/** Boundary of the warped sheet as a polyline (corner cut along a chord if curled). */
function paperOutline(P, w, h, curl) {
  const n = 48;
  const cu = curl ? CURL_UNITS / w : 0;
  const cv = curl ? CURL_UNITS / h : 0;
  const pts = [];
  for (let i = 0; i <= n; i += 1) pts.push(P(i / n, 0));
  for (let i = 1; i <= n; i += 1) pts.push(P(1, (i / n) * (1 - cv)));
  if (curl) {
    const a = P(1, 1 - cv);
    const b = P(1 - cu, 1);
    const c = P(1, 1);
    const ctrl = { x: (a.x + b.x) / 2 + (c.x - (a.x + b.x) / 2) * 0.35, y: (a.y + b.y) / 2 + (c.y - (a.y + b.y) / 2) * 0.35 };
    for (let i = 1; i < 10; i += 1) {
      const t = i / 10;
      pts.push({
        x: (1 - t) * (1 - t) * a.x + 2 * (1 - t) * t * ctrl.x + t * t * b.x,
        y: (1 - t) * (1 - t) * a.y + 2 * (1 - t) * t * ctrl.y + t * t * b.y,
      });
    }
  }
  for (let i = 0; i <= n; i += 1) pts.push(P((1 - cu) * (1 - i / n), 1));
  for (let i = 1; i < n; i += 1) pts.push(P(0, 1 - i / n));
  return pts;
}

function tracePath(ctx, pts, close = true) {
  ctx.beginPath();
  pts.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
  if (close) ctx.closePath();
}

/** Slightly shaky copy of a closed polyline, for the hand-drawn stroke. */
function wobble(pts, seed, amount = 0.45) {
  const rand = mulberry32(seed * 131 + 5);
  const o1 = rand() * Math.PI * 2;
  const o2 = rand() * Math.PI * 2;
  const n = pts.length;
  // Only 2–3 slow undulations around the whole sheet, so edges stay smooth.
  return pts.map((p, i) => {
    const t = (i / n) * Math.PI * 2;
    return {
      x: p.x + amount * Math.sin(t * 2 + o1),
      y: p.y + amount * Math.sin(t * 3 + o2),
    };
  });
}

/* ------------------------------------------------------------------ */
/* Drawing                                                             */
/* ------------------------------------------------------------------ */

function drawPaperSurface(ctx, P, outline, w, h, options, base, ink) {
  ctx.fillStyle = rgba(base);
  ctx.fill();

  // Soft inner shading along the edges (stronger on the left, like the reference).
  tracePath(ctx, outline);
  [[11, 0.05], [7, 0.05], [3.5, 0.06]].forEach(([width, alpha]) => {
    ctx.lineWidth = width;
    ctx.strokeStyle = rgba(ink, alpha);
    ctx.stroke();
  });
  const left = ctx.createLinearGradient(-w / 2 - 10, 0, -w / 2 + 34, 0);
  left.addColorStop(0, rgba(ink, 0.12));
  left.addColorStop(1, rgba(ink, 0));
  ctx.fillStyle = left;
  ctx.fillRect(-w / 2 - 20, -h / 2 - 20, w + 40, h + 40);

  // A faint diagonal crease, as if the sheet had been bent once.
  const crease = ctx.createLinearGradient(-w / 2, h / 2, -w / 2 + 30, h / 2 - 40);
  crease.addColorStop(0, rgba(ink, 0));
  crease.addColorStop(0.5, rgba(ink, 0.05));
  crease.addColorStop(0.56, rgba([255, 255, 255], 0.12));
  crease.addColorStop(1, rgba(ink, 0));
  ctx.fillStyle = crease;
  ctx.fillRect(-w / 2 - 20, -h / 2 - 20, w + 40, h + 40);

  const notebook = options.paper === 'notebook';
  if (options.lines || notebook) {
    const gap = notebook ? 9.5 : 19;
    const start = notebook ? 15 : 17;
    ctx.lineWidth = notebook ? 0.5 : 0.8;
    ctx.strokeStyle = notebook ? 'rgba(86, 140, 214, 0.5)' : rgba(ink, 0.17);
    ctx.lineCap = 'round';
    for (let y = start; y < h - 6; y += gap) {
      const v = y / h;
      const pts = [];
      for (let i = 0; i <= 40; i += 1) pts.push(P(0.02 + (i / 40) * 0.96, v));
      tracePath(ctx, pts, false);
      ctx.stroke();
    }
  }
  if (notebook) {
    const pts = [];
    for (let i = 0; i <= 40; i += 1) pts.push(P(14 / w, i / 40));
    tracePath(ctx, pts, false);
    ctx.strokeStyle = 'rgba(222, 72, 72, 0.65)';
    ctx.lineWidth = 0.6;
    ctx.stroke();
  }
}

function drawNoise(ctx, w, h, options) {
  const rand = mulberry32(options.seed ?? DEFAULT_OPTIONS.seed);
  const count = Math.round(w * h * 0.28);
  for (let i = 0; i < count; i += 1) {
    const x = -w / 2 - 10 + rand() * (w + 20);
    const y = -h / 2 - 10 + rand() * (h + 20);
    const s = 0.25 + rand() * 0.5;
    ctx.fillStyle = rand() > 0.45 ? `rgba(70,45,20,${0.03 + rand() * 0.05})` : `rgba(255,255,255,${0.06 + rand() * 0.1})`;
    ctx.fillRect(x, y, s, s);
  }
  if (options.paper === 'kraft') {
    ctx.lineWidth = 0.18;
    for (let i = 0; i < w * h * 0.012; i += 1) {
      const x = -w / 2 + rand() * w;
      const y = -h / 2 + rand() * h;
      const len = 1.5 + rand() * 4;
      const angle = rand() * Math.PI;
      ctx.strokeStyle = `rgba(90,55,20,${0.12 + rand() * 0.15})`;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(angle) * len, y + Math.sin(angle) * len);
      ctx.stroke();
    }
  }
}

function drawCurl(ctx, P, w, h, base, ink) {
  const a = P(1, 1 - CURL_UNITS / h);
  const b = P(1 - CURL_UNITS / w, 1);
  const c = P(1, 1);
  const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
  const tip = { x: a.x + b.x - c.x, y: a.y + b.y - c.y };
  tip.x += (mid.x - tip.x) * 0.12;
  tip.y += (mid.y - tip.y) * 0.12;
  const bulge = (p, q) => ({ x: (p.x + q.x) / 2 + (mid.x - (p.x + q.x) / 2) * -0.25, y: (p.y + q.y) / 2 + (mid.y - (p.y + q.y) / 2) * -0.25 });

  // shadow the flap casts on the sheet
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(tip.x - 1.6, tip.y - 1.2);
  ctx.lineTo(b.x, b.y);
  ctx.closePath();
  ctx.fillStyle = rgba(ink, 0.16);
  ctx.fill();
  ctx.restore();

  const q1 = bulge(a, tip);
  const q2 = bulge(tip, b);
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.quadraticCurveTo(q1.x, q1.y, tip.x, tip.y);
  ctx.quadraticCurveTo(q2.x, q2.y, b.x, b.y);
  ctx.quadraticCurveTo(mid.x + (c.x - mid.x) * 0.35, mid.y + (c.y - mid.y) * 0.35, a.x, a.y);
  ctx.closePath();
  const grad = ctx.createLinearGradient(tip.x, tip.y, mid.x, mid.y);
  grad.addColorStop(0, rgba(mixRgb(base, [255, 255, 255], 0.55)));
  grad.addColorStop(1, rgba(mixRgb(base, ink, 0.12)));
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.lineWidth = 1.5;
  ctx.lineJoin = 'round';
  ctx.strokeStyle = rgba(ink);
  ctx.stroke();
}

/** Position + angle of a point on the top edge, for attaching decorations. */
function topEdgeFrame(P, u) {
  const p = P(u, 0);
  const a = P(Math.max(0, u - 0.01), 0);
  const b = P(Math.min(1, u + 0.01), 0);
  return { x: p.x, y: p.y, angle: Math.atan2(b.y - a.y, b.x - a.x) };
}

const TAPE_SIZE = { width: 21, above: 11, below: 17 };
const TAPE_TILT = 4;
const CLIP_TILT = -6;
const tapeAnchor = (w) => (w > 150 ? 0.56 : 0.62);
const clipAnchor = (w) => (w > 150 ? 0.12 : 0.2);

function tapePolygon(width, above, below) {
  const teeth = 7;
  const depth = 1.5;
  const pts = [];
  for (let i = 0; i <= teeth * 2; i += 1) {
    pts.push({ x: -width / 2 + (width * i) / (teeth * 2), y: -above + (i % 2 ? depth : 0) });
  }
  for (let i = 0; i <= teeth * 2; i += 1) {
    pts.push({ x: width / 2 - (width * i) / (teeth * 2), y: below - (i % 2 ? depth : 0) });
  }
  return pts;
}

function drawTape(ctx, P, outline, w, options, base, ink) {
  const tape = TAPE_COLORS[options.tapeColor] || TAPE_COLORS.blue;
  const frame = topEdgeFrame(P, tapeAnchor(w));
  const poly = tapePolygon(TAPE_SIZE.width, TAPE_SIZE.above, TAPE_SIZE.below);
  const angle = frame.angle + toRad(TAPE_TILT);
  const place = () => {
    ctx.translate(frame.x, frame.y);
    ctx.rotate(angle);
  };

  // 1. translucent tape everywhere
  ctx.save();
  place();
  tracePath(ctx, poly);
  ctx.fillStyle = rgba(tape.fill, 0.68);
  ctx.fill();
  ctx.restore();

  // 2. where it sits on the paper it looks lighter (paper shows through)
  ctx.save();
  tracePath(ctx, outline);
  ctx.clip();
  place();
  tracePath(ctx, poly);
  ctx.fillStyle = rgba(mixRgb(mixRgb(base, [255, 255, 255], 0.62), tape.fill, 0.12), 0.94);
  ctx.fill();
  ctx.restore();

  // 3. paper edge faintly visible through the tape
  ctx.save();
  place();
  tracePath(ctx, poly);
  ctx.clip();
  ctx.rotate(-angle);
  ctx.translate(-frame.x, -frame.y);
  tracePath(ctx, outline);
  ctx.lineWidth = 1.4;
  ctx.strokeStyle = rgba(ink, 0.3);
  ctx.stroke();
  ctx.restore();

  // 4. outline
  ctx.save();
  place();
  tracePath(ctx, poly);
  ctx.lineWidth = 1.3;
  ctx.lineJoin = 'round';
  ctx.strokeStyle = tape.line;
  ctx.stroke();
  ctx.restore();
}

function drawPin(ctx, P, scale) {
  const p = P(0.5, 0.09);
  const r = 4.8;
  ctx.save();
  ctx.fillStyle = 'rgba(60, 35, 20, 0.22)';
  ctx.beginPath();
  ctx.ellipse(p.x + 1.4, p.y + 1.8, r, r * 0.85, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ef6b5f';
  ctx.beginPath();
  ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#d24c43';
  ctx.beginPath();
  ctx.arc(p.x + 0.6, p.y + 0.8, r * 0.62, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = 1.3;
  ctx.strokeStyle = '#5b2c27';
  ctx.beginPath();
  ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.beginPath();
  ctx.ellipse(p.x - 1.7, p.y - 1.8, 1.4, 0.9, toRad(-35), 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function paperclipPath(ctx) {
  // Local frame: x across, y down into the paper; top of the clip at y = -11.
  ctx.beginPath();
  ctx.moveTo(-2.2, 9);
  ctx.lineTo(-2.2, -6.8);
  ctx.arc(0.2, -6.8, 2.4, Math.PI, 0);
  ctx.lineTo(2.6, 13);
  ctx.arc(-0.6, 13, 3.2, 0, Math.PI);
  ctx.lineTo(-3.8, -7);
  ctx.arc(0.6, -7, 4.4, Math.PI, 0);
  ctx.lineTo(5, 7);
}

function drawClip(ctx, P, w) {
  const frame = topEdgeFrame(P, clipAnchor(w));
  ctx.save();
  ctx.translate(frame.x, frame.y);
  ctx.rotate(frame.angle + toRad(CLIP_TILT));
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.save();
  ctx.translate(1, 1.4);
  paperclipPath(ctx);
  ctx.strokeStyle = 'rgba(60, 40, 20, 0.2)';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.restore();
  paperclipPath(ctx);
  ctx.strokeStyle = '#4a5560';
  ctx.lineWidth = 3.1;
  ctx.stroke();
  paperclipPath(ctx);
  ctx.strokeStyle = '#d9e1e6';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.restore();
}

function fontString(options, size) {
  const family = options.fontFamily ? `"${options.fontFamily}", ${FALLBACK_FONTS}` : FALLBACK_FONTS;
  return `${options.fontWeight || 400} ${size}px ${family}`;
}

/** Draw laid-out lines glyph by glyph, following the paper warp. */
function drawWarpedText(ctx, P, w, h, lines, size, box, align, measureChar) {
  const lineStep = size * LINE_HEIGHT;
  const blockHeight = lines.length * lineStep;
  const startY = box.y + Math.max(0, (box.height - blockHeight) / 2) + lineStep / 2;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  lines.forEach((line, index) => {
    const chars = Array.from(line);
    const widths = chars.map(measureChar);
    const lineWidth = widths.reduce((sum, cw) => sum + cw, 0);
    let x = align === 'left' ? box.x : align === 'right' ? box.x + box.width - lineWidth : box.x + (box.width - lineWidth) / 2;
    const y = startY + index * lineStep;
    chars.forEach((ch, i) => {
      const cx = x + widths[i] / 2;
      x += widths[i];
      if (ch === ' ') return;
      const u = (cx + w / 2) / w;
      const v = (y + h / 2) / h;
      const p = P(u, v);
      const a = P(u - 0.004, v);
      const b = P(u + 0.004, v);
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(Math.atan2(b.y - a.y, b.x - a.x));
      ctx.fillText(ch, 0, 0);
      ctx.restore();
    });
  });
}

/* ------------------------------------------------------------------ */
/* Layout                                                              */
/* ------------------------------------------------------------------ */

const OUTLINE_MARGIN = 2.5;
const SHADOW_MARGIN = 5;

/** Paper warp, outline and the outermost points of every decoration. */
function buildGeometry(options) {
  const shape = SHAPES[options.shape] || SHAPES.square;
  const w = shape.width;
  const h = shape.height;
  const seed = Number(options.seed) || 0;
  const P = createPaperWarp(w, h, { warp: options.warp ?? DEFAULT_OPTIONS.warp, seed });
  const outline = paperOutline(P, w, h, options.curl);
  const extents = [...outline];

  const addLocal = (frame, angle, pts) => {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    pts.forEach((p) => extents.push({ x: frame.x + p.x * c - p.y * s, y: frame.y + p.x * s + p.y * c }));
  };
  if (options.decoration === 'tape') {
    const frame = topEdgeFrame(P, tapeAnchor(w));
    addLocal(frame, frame.angle + toRad(TAPE_TILT), tapePolygon(TAPE_SIZE.width, TAPE_SIZE.above, TAPE_SIZE.below));
  } else if (options.decoration === 'clip') {
    const frame = topEdgeFrame(P, clipAnchor(w));
    addLocal(frame, frame.angle + toRad(CLIP_TILT), [
      { x: -6.5, y: -13 },
      { x: 7.5, y: -13 },
      { x: 7.5, y: 18.5 },
      { x: -6.5, y: 18.5 },
    ]);
  }
  return { w, h, P, outline, extents };
}

/**
 * Canvas size and paper placement. The canvas is fitted tightly around the
 * rotated paper and its decorations (plus room for the outline and shadow),
 * so nothing is ever cropped and the note uses as much of the image as possible.
 */
export function computeLayout(inputOptions = {}, geometry = null) {
  const options = { ...DEFAULT_OPTIONS, ...inputOptions };
  const geo = geometry || buildGeometry(options);
  const rotation = toRad(clamp(Number(options.rotation) || 0, -MAX_ROTATION, MAX_ROTATION));
  const c = Math.cos(rotation);
  const s = Math.sin(rotation);
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  geo.extents.forEach((p) => {
    const x = p.x * c - p.y * s;
    const y = p.x * s + p.y * c;
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  });
  const margin = OUTLINE_MARGIN + (options.shadow ? SHADOW_MARGIN : 0);
  const unitsWidth = maxX - minX + margin * 2;
  const unitsHeight = maxY - minY + margin * 2;
  const longEdge = Math.max(1, Math.round((options.size || DEFAULT_OPTIONS.size) * (options.pixelRatio || 1)));
  const scale = longEdge / Math.max(unitsWidth, unitsHeight);
  return {
    paperWidth: geo.w,
    paperHeight: geo.h,
    unitsWidth,
    unitsHeight,
    originX: margin - minX,
    originY: margin - minY,
    bounds: { minX, minY, maxX, maxY },
    scale,
    canvasWidth: Math.round(unitsWidth * scale),
    canvasHeight: Math.round(unitsHeight * scale),
  };
}

/* ------------------------------------------------------------------ */
/* Main entry                                                          */
/* ------------------------------------------------------------------ */

/**
 * Draw a sticky note on `canvas`. Resizes the canvas to fit the layout.
 * Returns { width, height, fontSize, lines, overflow }.
 */
export function renderStickyNote(canvas, inputOptions = {}) {
  const options = { ...DEFAULT_OPTIONS, ...inputOptions };
  const geometry = buildGeometry(options);
  const layout = computeLayout(options, geometry);
  canvas.width = layout.canvasWidth;
  canvas.height = layout.canvasHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('renderStickyNote: 2D canvas context is not available');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const { w, h, P, outline } = geometry;
  const seed = Number(options.seed) || 0;
  const base = paperRgb(options);
  const ink = outlineRgb(base);
  const rotation = clamp(Number(options.rotation) || 0, -MAX_ROTATION, MAX_ROTATION);

  ctx.save();
  ctx.scale(layout.scale, layout.scale);
  ctx.translate(layout.originX, layout.originY);
  ctx.rotate(toRad(rotation));

  if (options.shadow) {
    ctx.save();
    tracePath(ctx, outline);
    ctx.shadowColor = 'rgba(60, 40, 20, 0.24)';
    ctx.shadowBlur = 4 * layout.scale;
    ctx.shadowOffsetX = 1 * layout.scale;
    ctx.shadowOffsetY = 2.6 * layout.scale;
    ctx.fillStyle = rgba(base);
    ctx.fill();
    ctx.restore();
  }

  // Paper body, clipped to the warped outline.
  ctx.save();
  tracePath(ctx, outline);
  ctx.clip();
  tracePath(ctx, outline);
  drawPaperSurface(ctx, P, outline, w, h, options, base, ink);
  if (options.noise) drawNoise(ctx, w, h, options);

  // Text: lay out flat, then follow the warp.
  const box = getTextBox(options, layout);
  const charCache = new Map();
  const measureAt = (size) => {
    ctx.font = fontString(options, size);
    const cache = new Map();
    const charWidth = (ch) => {
      if (!cache.has(ch)) cache.set(ch, ctx.measureText(ch).width);
      return cache.get(ch);
    };
    charCache.set(size, charWidth);
    return (str) => Array.from(str).reduce((sum, ch) => sum + charWidth(ch), 0);
  };
  const min = Math.max(1, Number(options.minFontSize) || FONT_SIZE_LIMITS.min);
  const max = Math.max(min, Number(options.maxFontSize) || FONT_SIZE_LIMITS.max);
  let fitted;
  if (options.fontSizeMode === 'manual') {
    const size = clamp(Number(options.fontSize) || DEFAULT_OPTIONS.fontSize, 1, 200);
    const lines = wrapText(options.text, box.width, measureAt(size));
    fitted = { size, lines, overflow: lines.length * size * LINE_HEIGHT > box.height };
  } else {
    fitted = fitText(options.text, box, measureAt, { min, max });
  }
  measureAt(fitted.size);
  ctx.font = fontString(options, fitted.size);
  ctx.fillStyle = options.textColor || DEFAULT_OPTIONS.textColor;
  const align = ALIGNMENTS.includes(options.align) ? options.align : 'center';
  drawWarpedText(ctx, P, w, h, fitted.lines, fitted.size, box, align, charCache.get(fitted.size));
  ctx.restore(); // end paper clip

  // Hand-drawn outline.
  tracePath(ctx, wobble(outline, seed));
  ctx.lineWidth = 1.4;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.strokeStyle = rgba(ink);
  ctx.stroke();

  if (options.curl) drawCurl(ctx, P, w, h, base, ink);

  if (options.decoration === 'tape') drawTape(ctx, P, outline, w, options, base, ink);
  else if (options.decoration === 'pin') drawPin(ctx, P, layout.scale);
  else if (options.decoration === 'clip') drawClip(ctx, P, w);

  ctx.restore();

  return {
    width: canvas.width,
    height: canvas.height,
    fontSize: fitted.size,
    lines: fitted.lines,
    overflow: fitted.overflow,
  };
}

/** e.g. sticky-note-20261117-2159.png — ASCII only, safe for VTS. */
export function buildExportFileName(date = new Date(), customName = '') {
  const slug = String(customName || '')
    .trim()
    .toLowerCase()
    .replace(/\.png$/, '')
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  if (slug) return `${slug}.png`;
  const pad = (n) => String(n).padStart(2, '0');
  return `sticky-note-${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}-${pad(date.getHours())}${pad(date.getMinutes())}.png`;
}
