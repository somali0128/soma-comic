/**
 * Exchange rates for the 换算 app.
 *
 * Primary source: Frankfurter (European Central Bank reference rates, free,
 * no API key, CORS enabled). Backup: ExchangeRate-API's open endpoint.
 * The last successful result is cached in localStorage so the currency tab
 * keeps working offline; the UI always shows the date of the rates in use.
 */

import { CURRENCIES } from './units';

export const RATES_CACHE_KEY = 'soma-convert-rates-v1';
const SYMBOLS = CURRENCIES.map((currency) => currency.id).filter((id) => id !== 'USD');

const SOURCES = [
  {
    name: '欧洲央行（Frankfurter）',
    url: `https://api.frankfurter.dev/v1/latest?base=USD&symbols=${SYMBOLS.join(',')}`,
    parse: (json) => ({ date: json.date, rates: json.rates }),
  },
  {
    name: 'ExchangeRate-API',
    url: 'https://open.er-api.com/v6/latest/USD',
    parse: (json) => {
      if (json.result !== 'success') throw new Error('bad response');
      const date = new Date(json.time_last_update_unix * 1000).toISOString().slice(0, 10);
      return { date, rates: json.rates };
    },
  },
];

const normalize = ({ date, rates }, source) => {
  const picked = { USD: 1 };
  SYMBOLS.forEach((id) => {
    const value = Number(rates?.[id]);
    if (Number.isFinite(value) && value > 0) picked[id] = value;
  });
  if (Object.keys(picked).length < 4) throw new Error('missing rates');
  return { base: 'USD', date: String(date || ''), rates: picked, source, fetchedAt: Date.now() };
};

export function loadCachedRates(storage = safeStorage()) {
  if (!storage) return null;
  try {
    const cached = JSON.parse(storage.getItem(RATES_CACHE_KEY) || 'null');
    if (cached && cached.rates && cached.rates.USD === 1) return cached;
  } catch {
    /* ignore */
  }
  return null;
}

function saveCachedRates(data, storage = safeStorage()) {
  if (!storage) return;
  try {
    storage.setItem(RATES_CACHE_KEY, JSON.stringify(data));
  } catch {
    /* ignore */
  }
}

function safeStorage() {
  try {
    return typeof window === 'undefined' ? null : window.localStorage;
  } catch {
    return null;
  }
}

/** Fetch fresh rates (trying each source in turn). Throws if all fail. */
export async function fetchRates(fetchImpl = typeof fetch === 'undefined' ? null : fetch) {
  if (!fetchImpl) throw new Error('fetch unavailable');
  let lastError;
  for (const source of SOURCES) {
    try {
      const controller = typeof AbortController === 'undefined' ? null : new AbortController();
      const timer = controller ? setTimeout(() => controller.abort(), 8000) : null;
      const response = await fetchImpl(source.url, controller ? { signal: controller.signal } : undefined);
      if (timer) clearTimeout(timer);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = normalize(source.parse(await response.json()), source.name);
      saveCachedRates(data);
      return data;
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError || new Error('no source');
}

/** Rates older than this are refreshed in the background when online. */
export const RATES_MAX_AGE_MS = 6 * 60 * 60 * 1000;
