/**
 * "My presets" for the sticky-note generator, stored in localStorage.
 * Every read/write is wrapped in try/catch: private mode, a full quota or
 * corrupted JSON must never break the page.
 */

export const PRESETS_STORAGE_KEY = 'vts-sticky-note-presets-v1';
export const MAX_PRESETS = 30;

/** Option keys a preset remembers (text + style, not export size). */
export const PRESET_KEYS = [
  'text',
  'fontId',
  'fontSizeMode',
  'fontSize',
  'align',
  'textColor',
  'paper',
  'customColor',
  'shape',
  'decoration',
  'shadow',
  'curl',
  'noise',
  'rotation',
];

const getStorage = () => {
  try {
    return typeof window === 'undefined' ? null : window.localStorage;
  } catch {
    return null;
  }
};

const pickPresetOptions = (options = {}) =>
  PRESET_KEYS.reduce((picked, key) => {
    if (options[key] !== undefined) picked[key] = options[key];
    return picked;
  }, {});

const isValidPreset = (preset) =>
  preset &&
  typeof preset === 'object' &&
  typeof preset.id === 'string' &&
  typeof preset.name === 'string' &&
  preset.options &&
  typeof preset.options === 'object';

export function loadPresets(storage = getStorage()) {
  if (!storage) return [];
  try {
    const parsed = JSON.parse(storage.getItem(PRESETS_STORAGE_KEY) || '[]');
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(isValidPreset)
      .map((preset) => ({ ...preset, options: pickPresetOptions(preset.options) }))
      .slice(0, MAX_PRESETS);
  } catch {
    return [];
  }
}

export function savePresets(presets, storage = getStorage()) {
  if (!storage) return false;
  try {
    storage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(presets.slice(0, MAX_PRESETS)));
    return true;
  } catch {
    return false;
  }
}

/** Returns a new list with the preset added (or replaced if the name exists). */
export function upsertPreset(presets, name, options, now = Date.now()) {
  const trimmed = String(name || '').trim().slice(0, 24);
  if (!trimmed) return presets;
  const existing = presets.find((preset) => preset.name === trimmed);
  const preset = {
    id: existing ? existing.id : `preset-${now.toString(36)}`,
    name: trimmed,
    options: pickPresetOptions(options),
  };
  const rest = presets.filter((item) => item.name !== trimmed);
  return [preset, ...rest].slice(0, MAX_PRESETS);
}

export function removePreset(presets, id) {
  return presets.filter((preset) => preset.id !== id);
}
