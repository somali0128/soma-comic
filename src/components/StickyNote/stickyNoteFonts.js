/**
 * Fonts for the sticky-note generator.
 *
 * All fonts are SIL Open Font License (free for commercial use) and served by
 * Google Fonts. Google slices CJK fonts by unicode-range, so the browser only
 * downloads the slices (~40 KB each) that contain the characters actually typed,
 * instead of a 5–20 MB font file. The stylesheet is injected only when this page
 * is opened, so other pages are unaffected.
 */

export const STICKY_NOTE_FONTS = [
  { id: 'long-cang', label: '龙藏体 · 手写', family: 'Long Cang', weight: 400, query: 'Long+Cang' },
  { id: 'zhi-mang-xing', label: '志莽行书 · 行书', family: 'Zhi Mang Xing', weight: 400, query: 'Zhi+Mang+Xing' },
  { id: 'ma-shan-zheng', label: '马善政 · 毛笔', family: 'Ma Shan Zheng', weight: 400, query: 'Ma+Shan+Zheng' },
  { id: 'zcool-kuaile', label: '站酷快乐体 · 圆润', family: 'ZCOOL KuaiLe', weight: 400, query: 'ZCOOL+KuaiLe' },
  { id: 'noto-sans-sc', label: '思源黑体 · 清晰', family: 'Noto Sans SC', weight: 700, query: 'Noto+Sans+SC:wght@700' },
];

export const DEFAULT_FONT_ID = STICKY_NOTE_FONTS[0].id;

export const getStickyNoteFont = (id) =>
  STICKY_NOTE_FONTS.find((font) => font.id === id) || STICKY_NOTE_FONTS[0];

const STYLESHEET_ID = 'sticky-note-fonts';
const STYLESHEET_URL = `https://fonts.googleapis.com/css2?${STICKY_NOTE_FONTS.map(
  (font) => `family=${font.query}`
).join('&')}&display=block`;

let stylesheetPromise = null;

/** Inject the Google Fonts stylesheet once and resolve when its rules exist. */
export function ensureFontStylesheet(doc = typeof document === 'undefined' ? null : document) {
  if (!doc) return Promise.resolve(false);
  if (stylesheetPromise) return stylesheetPromise;

  stylesheetPromise = new Promise((resolve) => {
    const existing = doc.getElementById(STYLESHEET_ID);
    if (existing) {
      resolve(true);
      return;
    }
    const link = doc.createElement('link');
    link.id = STYLESHEET_ID;
    link.rel = 'stylesheet';
    link.href = STYLESHEET_URL;
    link.onload = () => resolve(true);
    link.onerror = () => {
      stylesheetPromise = null; // allow a retry later
      link.remove();
      resolve(false);
    };
    doc.head.appendChild(link);
  });
  return stylesheetPromise;
}

const withTimeout = (promise, ms) =>
  Promise.race([promise, new Promise((resolve) => setTimeout(() => resolve('timeout'), ms))]);

/**
 * Make sure the glyphs needed for `text` are downloaded before drawing.
 * Resolves to 'ready' or 'failed' (then the canvas falls back to system fonts).
 */
export async function loadFontForText(fontId, text, { timeoutMs = 10000 } = {}) {
  const font = getStickyNoteFont(fontId);
  if (typeof document === 'undefined' || !document.fonts) return 'failed';

  const stylesheetOk = await withTimeout(ensureFontStylesheet(), timeoutMs);
  if (stylesheetOk !== true) return 'failed';

  const sample = `${text || ''}字Aa`.slice(0, 2000);
  const descriptor = `${font.weight} 48px "${font.family}"`;
  try {
    const result = await withTimeout(document.fonts.load(descriptor, sample), timeoutMs);
    if (result === 'timeout') return 'failed';
    return document.fonts.check(descriptor, sample) ? 'ready' : 'failed';
  } catch {
    return 'failed';
  }
}
