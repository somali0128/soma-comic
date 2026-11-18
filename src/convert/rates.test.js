import { RATES_CACHE_KEY, fetchRates, loadCachedRates } from './rates';

const ok = (body) => Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(body) });

describe('exchange rates', () => {
  beforeEach(() => window.localStorage.clear());

  test('uses Frankfurter first and caches the result', async () => {
    const fetchMock = vi.fn(() => ok({ date: '2026-11-17', rates: { CAD: 1.4, CNY: 7.1, EUR: 0.92, JPY: 150 } }));
    const data = await fetchRates(fetchMock);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toContain('frankfurter');
    expect(data.rates).toMatchObject({ USD: 1, CAD: 1.4, CNY: 7.1 });
    expect(data.date).toBe('2026-11-17');
    expect(loadCachedRates().rates.CAD).toBe(1.4);
  });

  test('falls back to the second source', async () => {
    const fetchMock = vi
      .fn()
      .mockImplementationOnce(() => Promise.reject(new Error('offline')))
      .mockImplementationOnce(() =>
        ok({ result: 'success', time_last_update_unix: 1763337600, rates: { USD: 1, CAD: 1.41, CNY: 7.12, HKD: 7.8 } })
      );
    const data = await fetchRates(fetchMock);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(data.rates.CAD).toBe(1.41);
    expect(data.source).toBe('ExchangeRate-API');
  });

  test('throws when every source fails and keeps the old cache', async () => {
    window.localStorage.setItem(RATES_CACHE_KEY, JSON.stringify({ base: 'USD', date: 'old', rates: { USD: 1, CAD: 1.3 } }));
    await expect(fetchRates(() => Promise.resolve({ ok: false, status: 500 }))).rejects.toThrow();
    expect(loadCachedRates().date).toBe('old');
  });

  test('ignores a corrupted cache', () => {
    window.localStorage.setItem(RATES_CACHE_KEY, 'nope');
    expect(loadCachedRates()).toBeNull();
  });
});
