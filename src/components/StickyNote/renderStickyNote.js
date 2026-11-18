/**
 * Sticky-note renderer for VTube Studio item images.
 *
 * Framework-free: it only needs a <canvas> (or OffscreenCanvas) and an options
 * object, so it can be reused outside this page (e.g. a future VTS plugin).
 * The same options always produce the same pixels — the paper grain uses a
 * seeded random generator.
 *
 * Fonts are NOT loaded here. Load the font for the text first
 * (see stickyNoteFonts.js), then call renderStickyNote.
 *
 * Geometry uses "paper units": the paper's short side is always 100 units.
 * Font sizes are in the same units, so they scale with the paper.
 */

export const PAPER_PRESETS = {
  yellow: { label: '经典黄', color: '#fdf08a' },
  pink: { label: '粉色', color: '#ffc6dc' },
  blue: { label: '蓝色', color: '#bfe3ff' },
  green: { label: '绿色', color: '#c9efb4' },
  notebook: { label: '横线本', color: '#fffdf6' },
  kraft: { label: '牛皮纸', color: '#cfa673' },
  custom: { label: '自定义', color: null },
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
  textColor: '#2a2522',
  paper: 'yellow',
  customColor: '#ffd8a8',
  shape: 'square',
  decoration: 'tape',
  shadow: true,
  curl: true,
  noise: true,
  rotation: -4,
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

/**
 * Canvas size and paper placement. The margin is sized for the worst case
 * (max rotation, shadow, decorations sticking out), so dragging the rotation
 * slider never rescales the paper and nothing is ever cropped.
 */
export function computeLayout(options = {}) {
  const shape = SHAPES[options.shape] || SHAPES.square;
  const { width, height } = shape;
  const theta = toRad(MAX_ROTATION);
  const boundW = width * Math.cos(theta) + height * Math.sin(theta);
  const boundH = width * Math.sin(theta) + height * Math.cos(theta);
  const pad = 22; // decorations overhang ≤ 14 units, shadow ≤ 8 units
  const unitsW = boundW + pad * 2;
  const unitsH = boundH + pad * 2;

  const longEdge = Math.max(1, Math.round((options.size || DEFAULT_OPTIONS.size) * (options.pixelRatio || 1)));
  const scale = longEdge / Math.max(unitsW, unitsH);
  return {
    paperWidth: width,
    paperHeight: height,
    unitsWidth: unitsW,
    unitsHeight: unitsH,
    scale,
    canvasWidth: Math.round(unitsW * scale),
    canvasHeight: Math.round(unitsH * scale),
  };
}

/** Text box inside the paper, in paper-centred units. */
export function getTextBox(options, layout) {
  const w = layout.paperWidth;
  const h = layout.paperHeight;
  const inset = 11;
  let left = -w / 2 + inset;
  const right = w / 2 - inset;
  let top = -h / 2 + inset;
  const bottom = h / 2 - inset - (options.curl ? 3 : 0);
  if (options.paper === 'notebook') left = -w / 2 + 20;
  if (options.decoration === 'tape' || options.decoration === 'clip') top += 6;
  if (options.decoration === 'pin') top += 8;
  return { x: left, y: top, width: right - left, height: bottom - top };
}

/* ------------------------------------------------------------------ */
/* Drawing helpers                                                     */
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

function shade(hex, amount) {
  const value = /^#?([0-9a-f]{6})$/i.exec(hex || '');
  if (!value) return hex;
  const n = parseInt(value[1], 16);
  const mix = (c) => clamp(Math.round(amount < 0 ? c * (1 + amount) : c + (255 - c) * amount), 0, 255);
  const r = mix(n >> 16);
  const g = mix((n >> 8) & 255);
  const b = mix(n & 255);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

function paperColor(options) {
  if (options.paper === 'custom') return options.customColor || DEFAULT_OPTIONS.customColor;
  return (PAPER_PRESETS[options.paper] || PAPER_PRESETS.yellow).color;
}

/** Outline of the paper; with curl the bottom-right corner is cut along a chord. */
function paperPath(ctx, w, h, curl) {
  const c = curl ? Math.min(w, h) * 0.16 : 0;
  ctx.beginPath();
  ctx.moveTo(-w / 2, -h / 2);
  ctx.lineTo(w / 2, -h / 2);
  if (c) {
    ctx.lineTo(w / 2, h / 2 - c);
    ctx.quadraticCurveTo(w / 2 - c * 0.42, h / 2 - c * 0.42, w / 2 - c, h / 2);
  } else {
    ctx.lineTo(w / 2, h / 2);
  }
  ctx.lineTo(-w / 2, h / 2);
  ctx.closePath();
}

function drawShadow(ctx, w, h, curl, scale) {
  ctx.save();
  paperPath(ctx, w, h, curl);
  ctx.shadowColor = 'rgba(30, 24, 16, 0.32)';
  ctx.shadowBlur = 5 * scale;
  ctx.shadowOffsetX = 0.8 * scale;
  ctx.shadowOffsetY = 2.6 * scale;
  ctx.fillStyle = '#000';
  ctx.fill();
  ctx.restore();
}

function drawPaperSurface(ctx, w, h, options, base) {
  ctx.fillStyle = base;
  ctx.fill();

  // Soft light falloff, slightly darker near the glued top edge.
  const glow = ctx.createLinearGradient(0, -h / 2, 0, h / 2);
  if (options.paper === 'notebook' || options.paper === 'kraft') {
    glow.addColorStop(0, 'rgba(255,255,255,0.10)');
    glow.addColorStop(1, 'rgba(0,0,0,0.05)');
  } else {
    glow.addColorStop(0, 'rgba(0,0,0,0.07)');
    glow.addColorStop(0.16, 'rgba(0,0,0,0)');
    glow.addColorStop(0.7, 'rgba(255,255,255,0.12)');
    glow.addColorStop(1, 'rgba(0,0,0,0.03)');
  }
  ctx.fillStyle = glow;
  ctx.fillRect(-w / 2, -h / 2, w, h);

  if (options.paper === 'notebook') {
    const gap = 9.5;
    ctx.lineWidth = 0.45;
    ctx.strokeStyle = 'rgba(86, 140, 214, 0.5)';
    for (let y = -h / 2 + 15; y < h / 2 - 2; y += gap) {
      ctx.beginPath();
      ctx.moveTo(-w / 2, y);
      ctx.lineTo(w / 2, y);
      ctx.stroke();
    }
    ctx.strokeStyle = 'rgba(222, 72, 72, 0.7)';
    ctx.lineWidth = 0.6;
    const marginX = -w / 2 + 14;
    ctx.beginPath();
    ctx.moveTo(marginX, -h / 2);
    ctx.lineTo(marginX, h / 2);
    ctx.stroke();
  }
}

function drawNoise(ctx, w, h, options) {
  const rand = mulberry32(options.seed ?? DEFAULT_OPTIONS.seed);
  const count = Math.round(w * h * 0.32);
  for (let i = 0; i < count; i += 1) {
    const x = -w / 2 + rand() * w;
    const y = -h / 2 + rand() * h;
    const s = 0.25 + rand() * 0.55;
    const dark = rand() > 0.45;
    ctx.fillStyle = dark ? `rgba(60,40,20,${0.035 + rand() * 0.06})` : `rgba(255,255,255,${0.05 + rand() * 0.1})`;
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

function drawCurl(ctx, w, h, base) {
  const c = Math.min(w, h) * 0.16;
  const ax = w / 2;
  const ay = h / 2 - c;
  const bx = w / 2 - c;
  const by = h / 2;
  const tipX = w / 2 - c * 0.86;
  const tipY = h / 2 - c * 0.86;

  // Shadow cast by the lifted flap onto the paper.
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(ax, ay);
  ctx.quadraticCurveTo(tipX + c * 0.2, tipY - c * 0.05, tipX - c * 0.06, tipY - c * 0.06);
  ctx.quadraticCurveTo(tipX - c * 0.05, tipY + c * 0.2, bx, by);
  ctx.closePath();
  ctx.fillStyle = 'rgba(40, 28, 10, 0.18)';
  ctx.fill();
  ctx.restore();

  // The flap (back of the paper).
  ctx.beginPath();
  ctx.moveTo(ax, ay);
  ctx.quadraticCurveTo(w / 2 - c * 0.5, h / 2 - c * 0.86, tipX, tipY);
  ctx.quadraticCurveTo(w / 2 - c * 0.86, h / 2 - c * 0.5, bx, by);
  ctx.quadraticCurveTo(w / 2 - c * 0.42, h / 2 - c * 0.42, ax, ay);
  ctx.closePath();
  const flap = ctx.createLinearGradient(tipX, tipY, w / 2 - c * 0.45, h / 2 - c * 0.45);
  flap.addColorStop(0, shade(base, 0.35));
  flap.addColorStop(1, shade(base, -0.12));
  ctx.fillStyle = flap;
  ctx.fill();
  ctx.lineWidth = 0.25;
  ctx.strokeStyle = 'rgba(60, 40, 20, 0.18)';
  ctx.stroke();
}

function drawTape(ctx, w, h) {
  const tw = Math.min(w * 0.42, 52);
  const th = 13;
  ctx.save();
  ctx.translate(0, -h / 2 + 1);
  ctx.rotate(toRad(-3));
  ctx.beginPath();
  const teeth = 6;
  ctx.moveTo(-tw / 2, -th / 2);
  ctx.lineTo(tw / 2, -th / 2);
  for (let i = 1; i <= teeth; i += 1) {
    const y = -th / 2 + (th / teeth) * i;
    ctx.lineTo(tw / 2 + (i % 2 ? -1.1 : 0), y);
  }
  ctx.lineTo(-tw / 2, th / 2);
  for (let i = teeth - 1; i >= 0; i -= 1) {
    const y = -th / 2 + (th / teeth) * i;
    ctx.lineTo(-tw / 2 + (i % 2 ? 1.1 : 0), y);
  }
  ctx.closePath();
  ctx.fillStyle = 'rgba(243, 236, 214, 0.78)';
  ctx.fill();
  ctx.lineWidth = 0.35;
  ctx.strokeStyle = 'rgba(120, 100, 70, 0.32)';
  ctx.stroke();
  const sheen = ctx.createLinearGradient(0, -th / 2, 0, th / 2);
  sheen.addColorStop(0, 'rgba(255,255,255,0.35)');
  sheen.addColorStop(0.5, 'rgba(255,255,255,0)');
  sheen.addColorStop(1, 'rgba(255,255,255,0.18)');
  ctx.fillStyle = sheen;
  ctx.fill();
  ctx.restore();
}

function drawPin(ctx, w, h, scale) {
  const x = 0;
  const y = -h / 2 + 9;
  const r = 5.2;
  ctx.save();
  // needle shadow on the paper
  ctx.strokeStyle = 'rgba(30, 20, 10, 0.25)';
  ctx.lineWidth = 1;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x + 1.2, y + 1.6);
  ctx.lineTo(x + 4.2, y + 5.4);
  ctx.stroke();
  // head
  ctx.shadowColor = 'rgba(30, 20, 10, 0.35)';
  ctx.shadowBlur = 2.2 * scale;
  ctx.shadowOffsetX = 0.6 * scale;
  ctx.shadowOffsetY = 1.4 * scale;
  const head = ctx.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.1, x, y, r);
  head.addColorStop(0, '#ff8a8f');
  head.addColorStop(0.55, '#e5484d');
  head.addColorStop(1, '#a8262c');
  ctx.fillStyle = head;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  ctx.beginPath();
  ctx.ellipse(x - r * 0.38, y - r * 0.42, r * 0.28, r * 0.18, toRad(-35), 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function clipPath(ctx, x, top, bottom, width) {
  // A paperclip as three nested U-turns, drawn as one stroke.
  const r1 = width / 2;
  const r2 = r1 * 0.72;
  const r3 = r1 * 0.45;
  ctx.beginPath();
  ctx.moveTo(x - r3, bottom - 10);
  ctx.lineTo(x - r3, top + r3 + 3);
  ctx.arc(x, top + r3 + 3, r3, Math.PI, 0);
  ctx.lineTo(x + r3, bottom - r2);
  ctx.arc(x + r3 - r2, bottom - r2, r2, 0, Math.PI);
  ctx.lineTo(x + r3 - r2 * 2, top + r1);
  ctx.arc(x + r3 - r2 * 2 + r1, top + r1, r1, Math.PI, 0);
  ctx.lineTo(x + r3 - r2 * 2 + r1 * 2, bottom - 16);
}

function drawClip(ctx, w, h, scale) {
  const x = -w / 2 + Math.min(w * 0.24, 26);
  const top = -h / 2 - 11;
  const bottom = -h / 2 + 24;
  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.shadowColor = 'rgba(30, 20, 10, 0.3)';
  ctx.shadowBlur = 1.6 * scale;
  ctx.shadowOffsetX = 0.6 * scale;
  ctx.shadowOffsetY = 1.2 * scale;
  clipPath(ctx, x, top, bottom, 9);
  ctx.strokeStyle = '#8c96a1';
  ctx.lineWidth = 1.7;
  ctx.stroke();
  ctx.shadowColor = 'transparent';
  clipPath(ctx, x, top, bottom, 9);
  ctx.strokeStyle = 'rgba(255,255,255,0.65)';
  ctx.lineWidth = 0.5;
  ctx.stroke();
  ctx.restore();
}

function fontString(options, size) {
  const family = options.fontFamily ? `"${options.fontFamily}", ${FALLBACK_FONTS}` : FALLBACK_FONTS;
  return `${options.fontWeight || 400} ${size}px ${family}`;
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
  const layout = computeLayout(options);
  canvas.width = layout.canvasWidth;
  canvas.height = layout.canvasHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('renderStickyNote: 2D canvas context is not available');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const w = layout.paperWidth;
  const h = layout.paperHeight;
  const base = paperColor(options);
  const rotation = clamp(Number(options.rotation) || 0, -MAX_ROTATION, MAX_ROTATION);

  ctx.save();
  ctx.scale(layout.scale, layout.scale);
  ctx.translate(layout.unitsWidth / 2, layout.unitsHeight / 2);
  ctx.rotate(toRad(rotation));

  if (options.shadow) drawShadow(ctx, w, h, options.curl, layout.scale);

  ctx.save();
  paperPath(ctx, w, h, options.curl);
  ctx.clip();
  paperPath(ctx, w, h, options.curl);
  drawPaperSurface(ctx, w, h, options, base);
  if (options.noise) drawNoise(ctx, w, h, options);

  // Text
  const box = getTextBox(options, layout);
  const measureAt = (size) => {
    ctx.font = fontString(options, size);
    return (str) => ctx.measureText(str).width;
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

  ctx.font = fontString(options, fitted.size);
  ctx.fillStyle = options.textColor || DEFAULT_OPTIONS.textColor;
  ctx.textBaseline = 'middle';
  const align = ALIGNMENTS.includes(options.align) ? options.align : 'center';
  ctx.textAlign = align;
  const lineStep = fitted.size * LINE_HEIGHT;
  const blockHeight = fitted.lines.length * lineStep;
  const startY = box.y + Math.max(0, (box.height - blockHeight) / 2) + lineStep / 2;
  const x = align === 'left' ? box.x : align === 'right' ? box.x + box.width : box.x + box.width / 2;
  fitted.lines.forEach((line, index) => {
    ctx.fillText(line, x, startY + index * lineStep);
  });
  ctx.restore(); // end paper clip

  if (options.curl) drawCurl(ctx, w, h, base);

  if (options.decoration === 'tape') drawTape(ctx, w, h);
  else if (options.decoration === 'pin') drawPin(ctx, w, h, layout.scale);
  else if (options.decoration === 'clip') drawClip(ctx, w, h, layout.scale);

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
