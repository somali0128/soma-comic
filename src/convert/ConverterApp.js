import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  CATEGORIES,
  COMPOUND,
  CURRENCIES,
  INGREDIENTS,
  SIZE_TABLES,
  convert,
  convertCooking,
  convertCurrency,
  evaluateInput,
  formatCompound,
  formatNumber,
  getCategory,
  isExpression,
  nearestSizeRow,
  plainNumber,
} from './units';
import { applyKey, currentEntry, displayInput, inputUnitsFor, loadState, saveState } from './convertState';
import { RATES_MAX_AGE_MS, fetchRates, loadCachedRates } from './rates';

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const NO_DECIMAL_CURRENCIES = ['JPY', 'KRW'];

function formatCurrency(value, code) {
  if (!Number.isFinite(value)) return '—';
  const digits = NO_DECIMAL_CURRENCIES.includes(code) ? 0 : Math.abs(value) < 1 ? 4 : 2;
  return new Intl.NumberFormat('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(value);
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const area = document.createElement('textarea');
      area.value = text;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      const ok = document.execCommand('copy');
      area.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

/** Results for every other unit of the category. */
function computeResults({ category, unitId, value, ingredient, rates, sizeGroup }) {
  if (category.kind === 'table') {
    const table = SIZE_TABLES[category.id];
    const rows = table.groups[sizeGroup].rows;
    const colIndex = table.columns.findIndex((column) => column.id === unitId);
    const rowIndex = Number.isFinite(value) ? nearestSizeRow(rows, colIndex, value) : -1;
    if (rowIndex < 0) return { rows: [], rowIndex };
    const row = rows[rowIndex];
    return {
      rowIndex,
      rows: table.columns
        .map((column, index) => ({
          unit: column,
          text: String(row[index]),
          copy: String(row[index]),
          next: table.numericColumns.includes(column.id) ? String(row[index]).replace(/[–-].*$/, '') : null,
        }))
        .filter((item) => item.unit.id !== unitId),
    };
  }

  if (category.kind === 'currency') {
    if (!rates) return { rows: [] };
    return {
      rows: CURRENCIES.filter((currency) => currency.id !== unitId && rates.rates[currency.id]).map((currency) => {
        const result = convertCurrency(value, unitId, currency.id, rates.rates);
        return { unit: currency, text: formatCurrency(result, currency.id), copy: plainNumber(result), next: plainNumber(result) };
      }),
    };
  }

  const from = category.units.find((unit) => unit.id === unitId);
  return {
    rows: category.units
      .filter((unit) => unit.id !== unitId)
      .map((unit) => {
        const result =
          category.kind === 'cooking' ? convertCooking(value, from, unit, ingredient) : convert(value, from, unit);
        return {
          unit,
          text: formatNumber(result),
          sub: unit.compound ? formatCompound(result, unit.compound) : '',
          copy: plainNumber(result),
          next: plainNumber(result),
        };
      }),
  };
}

/* ------------------------------------------------------------------ */
/* Pieces                                                              */
/* ------------------------------------------------------------------ */

function CategoryBar({ value, onChange }) {
  const refs = useRef({});
  useEffect(() => {
    refs.current[value]?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  }, [value]);
  return (
    <nav aria-label="换算类别" className="no-scrollbar flex min-w-0 flex-1 gap-2 overflow-x-auto py-3 pl-3 pr-2">
      {CATEGORIES.map((category) => {
        const active = category.id === value;
        return (
          <button
            key={category.id}
            ref={(node) => {
              refs.current[category.id] = node;
            }}
            type="button"
            onClick={() => onChange(category.id)}
            aria-pressed={active}
            className={`shrink-0 rounded-full border-[1.5px] px-4 py-2 text-[15px] font-bold transition-colors ${
              active
                ? 'border-ink bg-ink text-white dark:border-white dark:bg-white dark:text-ink'
                : 'border-ink/15 bg-white text-ink-soft dark:border-white/15 dark:bg-white/5 dark:text-white/70'
            }`}
          >
            {category.label}
          </button>
        );
      })}
    </nav>
  );
}

function Chips({ label, items, value, onChange }) {
  return (
    <div role="radiogroup" aria-label={label} className="no-scrollbar flex gap-1.5 overflow-x-auto px-4 pb-2">
      {items.map((item) => {
        const active = item.id === value;
        return (
          <button
            key={item.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(item.id)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-bold ${
              active ? 'bg-primary-500 text-white' : 'bg-primary-50 text-primary-700 dark:bg-primary-500/15 dark:text-primary-200'
            }`}
          >
            {item.name}
          </button>
        );
      })}
    </div>
  );
}

function UnitSheet({ open, title, units, selected, stars, onSelect, onToggleStar, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 flex flex-col justify-end" role="dialog" aria-modal="true" aria-label={title}>
      <button type="button" aria-label="关闭" className="absolute inset-0 bg-black/35" onClick={onClose} />
      <div className="relative max-h-[75dvh] overflow-hidden rounded-t-3xl border-t-[1.5px] border-ink bg-paper pb-safe dark:border-white/20 dark:bg-[#1c1f24]">
        <div className="flex items-center justify-between px-5 pb-2 pt-4">
          <h2 className="text-lg font-extrabold">{title}</h2>
          <button type="button" onClick={onClose} className="rounded-full px-3 py-1.5 text-sm font-bold text-primary-600 dark:text-primary-300">
            完成
          </button>
        </div>
        <p className="px-5 pb-2 text-xs text-ink-mute dark:text-white/50">点 ☆ 把常用单位置顶</p>
        <ul className="max-h-[60dvh] overflow-y-auto px-3 pb-3">
          {units.map((unit) => {
            const active = unit.id === selected;
            const starred = stars.includes(unit.id);
            return (
              <li key={unit.id} className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onSelect(unit.id)}
                  className={`flex min-h-[52px] flex-1 items-center justify-between rounded-2xl px-4 text-left ${
                    active ? 'bg-ink text-white dark:bg-white dark:text-ink' : 'active:bg-black/5 dark:active:bg-white/10'
                  }`}
                >
                  <span className="text-base font-bold">{unit.name}</span>
                  <span className={`text-sm ${active ? 'opacity-80' : 'text-ink-mute dark:text-white/50'}`}>{unit.abbr}</span>
                </button>
                <button
                  type="button"
                  onClick={() => onToggleStar(unit.id)}
                  aria-pressed={starred}
                  aria-label={starred ? `取消置顶 ${unit.name}` : `置顶 ${unit.name}`}
                  className={`flex h-[52px] w-12 items-center justify-center text-xl ${starred ? 'text-[#e3a008]' : 'text-ink/25 dark:text-white/25'}`}
                >
                  {starred ? '★' : '☆'}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function ResultRow({ item, starred, onPick, onCopy }) {
  const timer = useRef(null);
  const longPressed = useRef(false);
  const start = () => {
    longPressed.current = false;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      longPressed.current = true;
      onCopy(item);
    }, 450);
  };
  const cancel = () => clearTimeout(timer.current);
  return (
    <li>
      <button
        type="button"
        onPointerDown={start}
        onPointerUp={cancel}
        onPointerLeave={cancel}
        onPointerCancel={cancel}
        onContextMenu={(event) => event.preventDefault()}
        onClick={() => {
          if (longPressed.current) return;
          if (item.next !== null) onPick(item);
        }}
        className="no-callout flex min-h-[52px] w-full items-center justify-between gap-3 border-b border-ink/[0.07] px-4 py-2 text-left active:bg-black/[0.04] dark:border-white/[0.07] dark:active:bg-white/[0.06]"
      >
        <span className="min-w-0">
          <span className="block text-[15px] font-bold">
            {starred && <span className="mr-1 text-xs text-[#e3a008]">★</span>}
            {item.unit.name}
          </span>
          <span className="block truncate text-xs text-ink-mute dark:text-white/45">{item.unit.abbr}</span>
        </span>
        <span className="text-right">
          <span className="block break-all text-xl font-semibold tabular-nums">{item.text}</span>
          {item.sub && <span className="block text-xs font-semibold text-primary-600 dark:text-primary-300">{item.sub}</span>}
        </span>
      </button>
    </li>
  );
}

function Key({ label, caption, onPress, variant = 'num', wide = false, ariaLabel }) {
  const styles = {
    num: 'bg-white text-ink dark:bg-white/10 dark:text-white',
    op: 'bg-primary-50 text-primary-700 dark:bg-primary-500/20 dark:text-primary-200',
    fn: 'bg-paper-deep text-ink-soft dark:bg-white/5 dark:text-white/70',
    eq: 'bg-primary-500 text-white',
  };
  return (
    <button
      type="button"
      onClick={onPress}
      aria-label={ariaLabel || label}
      className={`flex flex-col items-center justify-center rounded-2xl text-[22px] font-semibold leading-none shadow-[0_1px_0_rgba(20,22,26,0.08)] transition-transform active:scale-95 ${styles[variant]} ${
        wide ? 'col-span-2' : ''
      }`}
      style={{ height: 'clamp(40px, 6.8dvh, 58px)' }}
    >
      {label}
      {caption && <span className="mt-0.5 text-[10px] font-bold opacity-70">{caption}</span>}
    </button>
  );
}

function Keypad({ onKey, compound }) {
  const marker = compound ? COMPOUND[compound] : null;
  return (
    <div className="grid grid-cols-4 gap-1.5 px-3 pt-1 min-[380px]:gap-2">
      <Key label="C" variant="fn" ariaLabel="清空" onPress={() => onKey('clear')} />
      <Key label="±" variant="fn" ariaLabel="正负号" onPress={() => onKey('sign')} />
      <Key label="÷" variant="op" ariaLabel="除" onPress={() => onKey('÷')} />
      <Key label="⌫" variant="fn" ariaLabel="删除" onPress={() => onKey('back')} />
      {['7', '8', '9'].map((d) => <Key key={d} label={d} onPress={() => onKey(d)} />)}
      <Key label="×" variant="op" ariaLabel="乘" onPress={() => onKey('×')} />
      {['4', '5', '6'].map((d) => <Key key={d} label={d} onPress={() => onKey(d)} />)}
      <Key label="−" variant="op" ariaLabel="减" onPress={() => onKey('-')} />
      {['1', '2', '3'].map((d) => <Key key={d} label={d} onPress={() => onKey(d)} />)}
      <Key label="+" variant="op" ariaLabel="加" onPress={() => onKey('+')} />
      {marker ? (
        <>
          <Key label={marker.major} caption={marker.majorLabel} variant="op" ariaLabel={`输入${marker.majorLabel}`} onPress={() => onKey(marker.major)} />
          <Key label="0" onPress={() => onKey('0')} />
          <Key label="." ariaLabel="小数点" onPress={() => onKey('.')} />
          <Key label={marker.minor} caption={marker.minorLabel} variant="op" ariaLabel={`输入${marker.minorLabel}`} onPress={() => onKey(marker.minor)} />
        </>
      ) : (
        <>
          <Key label="0" wide onPress={() => onKey('0')} />
          <Key label="." ariaLabel="小数点" onPress={() => onKey('.')} />
          <Key label="=" variant="eq" ariaLabel="计算结果" onPress={() => onKey('=')} />
        </>
      )}
    </div>
  );
}

function HelpSheet({ open, onClose }) {
  if (!open) return null;
  const tips = [
    ['输入一个数', '下面会同时列出换算成所有单位的结果。'],
    ['点一行', '把它换成输入单位，接着往下换算。'],
    ['长按一行', '复制这个数。'],
    ['点输入单位', '换单位；点 ☆ 可以把常用单位置顶。'],
    ['身高、斤两', '选「英尺」可以直接输 5′11″；选「斤」可以输 1斤2两；选「磅」可以输 3lb4oz。'],
    ['算式', '支持 + − × ÷，比如 1.5+0.75。'],
    ['离线', '打开过一次之后，没网也能用；汇率会用上次更新的数据。'],
  ];
  return (
    <div className="fixed inset-0 z-40 flex flex-col justify-end" role="dialog" aria-modal="true" aria-label="使用说明">
      <button type="button" aria-label="关闭" className="absolute inset-0 bg-black/35" onClick={onClose} />
      <div className="relative max-h-[80dvh] overflow-y-auto rounded-t-3xl border-t-[1.5px] border-ink bg-paper px-5 pb-safe pt-5 dark:border-white/20 dark:bg-[#1c1f24]">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold">怎么用</h2>
          <button type="button" onClick={onClose} className="rounded-full px-3 py-1.5 text-sm font-bold text-primary-600 dark:text-primary-300">
            知道了
          </button>
        </div>
        <dl className="mt-3 space-y-3 pb-4">
          {tips.map(([title, body]) => (
            <div key={title}>
              <dt className="text-[15px] font-bold">{title}</dt>
              <dd className="text-sm leading-relaxed text-ink-soft dark:text-white/65">{body}</dd>
            </div>
          ))}
          <div className="rounded-2xl bg-primary-50 p-3 dark:bg-primary-500/15">
            <dt className="text-[15px] font-bold">放到手机桌面</dt>
            <dd className="text-sm leading-relaxed text-ink-soft dark:text-white/70">
              安卓 Chrome：右上角 ⋮ →「添加到主屏幕」（或「安装应用」）。iPhone Safari：分享按钮 →「添加到主屏幕」。
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* App                                                                 */
/* ------------------------------------------------------------------ */

export default function ConverterApp() {
  const [state, setState] = useState(loadState);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [rates, setRates] = useState(loadCachedRates);
  const [ratesStatus, setRatesStatus] = useState('idle');
  const [showTable, setShowTable] = useState(false);
  const [keypadOpen, setKeypadOpen] = useState(true);
  const toastTimer = useRef(null);

  const category = getCategory(state.category);
  const { unit: unitId, input } = currentEntry(state, category.id);
  const units = inputUnitsFor(category.id);
  const inputUnit = units.find((unit) => unit.id === unitId) || units[0];
  const compound = category.kind === 'table' || category.kind === 'currency' ? null : inputUnit?.compound || null;
  const value = evaluateInput(input, compound);
  const ingredient = INGREDIENTS.find((item) => item.id === state.ingredient) || INGREDIENTS[0];
  const sizeGroup = state.sizeGroup[category.id] || 'men';
  const stars = state.stars[category.id] || [];

  useEffect(() => {
    saveState(state);
  }, [state]);

  const refreshRates = useCallback(async () => {
    setRatesStatus('loading');
    try {
      setRates(await fetchRates());
      setRatesStatus('idle');
    } catch {
      setRatesStatus('failed');
    }
  }, []);

  useEffect(() => {
    if (category.kind !== 'currency') return;
    const stale = !rates || Date.now() - (rates.fetchedAt || 0) > RATES_MAX_AGE_MS;
    if (stale && ratesStatus === 'idle' && (typeof navigator === 'undefined' || navigator.onLine !== false)) refreshRates();
  }, [category.kind, rates, ratesStatus, refreshRates]);

  const setEntry = useCallback(
    (patch) =>
      setState((current) => ({
        ...current,
        perCategory: {
          ...current.perCategory,
          [current.category]: { ...currentEntry(current, current.category), ...patch },
        },
      })),
    []
  );

  const showToast = (text) => {
    setToast(text);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 1400);
  };

  const handleKey = (key) => {
    setEntry({
      input: applyKey(input, key, {
        evaluate: (text) => evaluateInput(text, compound),
        format: (result) => plainNumber(result),
      }),
    });
  };

  // Physical keyboard support (desktop / tablets).
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.target instanceof HTMLInputElement || sheetOpen || helpOpen) return;
      const map = { '*': '×', '/': '÷', Backspace: 'back', Escape: 'clear', Enter: '=', '=': '=' };
      const key = map[event.key] || event.key;
      if (/^[\d.+\-×÷]$/.test(key) || ['back', 'clear', '='].includes(key)) {
        event.preventDefault();
        handleKey(key);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  const results = useMemo(
    () => computeResults({ category, unitId, value, ingredient, rates, sizeGroup }),
    [category, unitId, value, ingredient, rates, sizeGroup]
  );
  const orderedRows = useMemo(() => {
    const starred = results.rows.filter((row) => stars.includes(row.unit.id));
    const rest = results.rows.filter((row) => !stars.includes(row.unit.id));
    return [...starred, ...rest];
  }, [results, stars]);

  const pickRow = (item) => {
    setEntry({ unit: item.unit.id, input: item.next });
  };
  const copyRow = async (item) => {
    const ok = await copyText(item.copy);
    showToast(ok ? `已复制 ${item.copy}` : '复制失败');
  };

  const toggleStar = (id) =>
    setState((current) => {
      const list = current.stars[current.category] || [];
      const next = list.includes(id) ? list.filter((item) => item !== id) : [...list, id];
      return { ...current, stars: { ...current.stars, [current.category]: next } };
    });

  const table = category.kind === 'table' ? SIZE_TABLES[category.id] : null;
  const exprResult = isExpression(input) && Number.isFinite(value) ? value : null;
  const inputCompound = compound && Number.isFinite(value) ? formatCompound(value, compound) : '';

  return (
    <div className="mx-auto flex h-[100dvh] max-w-md flex-col">
      {/* Header */}
      <header className="pt-safe shrink-0">
        <h1 className="sr-only">换算</h1>
        <div className="flex items-center">
          <CategoryBar value={category.id} onChange={(id) => setState((current) => ({ ...current, category: id }))} />
          <button
            type="button"
            onClick={() => setHelpOpen(true)}
            aria-label="使用说明"
            className="mr-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-[1.5px] border-ink/15 text-base font-bold text-ink-soft dark:border-white/15 dark:text-white/70"
          >
            ?
          </button>
        </div>
        {category.kind === 'cooking' && (
          <Chips
            label="食材"
            items={INGREDIENTS}
            value={ingredient.id}
            onChange={(id) => setState((current) => ({ ...current, ingredient: id }))}
          />
        )}
        {table && (
          <Chips
            label="男女"
            items={Object.entries(table.groups).map(([id, group]) => ({ id, name: group.label }))}
            value={sizeGroup}
            onChange={(id) => setState((current) => ({ ...current, sizeGroup: { ...current.sizeGroup, [category.id]: id } }))}
          />
        )}
      </header>

      {/* Input */}
      <section
        onClick={() => setKeypadOpen(true)}
        className="mx-3 shrink-0 rounded-3xl border-[1.5px] border-ink bg-white px-4 py-2.5 shadow-[3px_3px_0_#14161a] dark:border-white/25 dark:bg-white/[0.06] dark:shadow-none">
        <div className="flex items-start justify-between gap-3">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setSheetOpen(true);
            }}
            className="flex shrink-0 items-center gap-1 rounded-full bg-paper-deep px-3 py-2 text-left dark:bg-white/10"
            aria-label={`输入单位：${inputUnit?.name}，点按更换`}
          >
            <span className="text-[15px] font-extrabold">{inputUnit?.name}</span>
            <span className="text-xs text-ink-mute dark:text-white/55">{inputUnit?.abbr}</span>
            <span aria-hidden="true" className="text-xs">▾</span>
          </button>
          <div className="min-w-0 flex-1 text-right" aria-live="polite">
            <p
              className={`break-all font-semibold leading-tight tabular-nums ${
                input.length > 12 ? 'text-xl' : input.length > 7 ? 'text-[26px]' : 'text-[32px]'
              }`}
            >
              {input ? displayInput(input) : <span className="text-ink/25 dark:text-white/25">0</span>}
            </p>
            {exprResult !== null && (
              <p className="text-sm font-semibold text-primary-600 dark:text-primary-300">= {formatNumber(exprResult)}</p>
            )}
            {inputCompound && exprResult === null && (
              <p className="text-sm font-semibold text-primary-600 dark:text-primary-300">{inputCompound}</p>
            )}
          </div>
        </div>
      </section>

      {/* Results */}
      <main className="mt-2 min-h-0 flex-1 overflow-y-auto overscroll-contain">
        {category.kind === 'currency' && (
          <div className="flex items-center justify-between gap-2 px-4 py-1.5 text-xs text-ink-mute dark:text-white/50">
            <span>
              {ratesStatus === 'loading' && !rates && '正在获取汇率…'}
              {rates && `汇率日期 ${rates.date} · ${rates.source}`}
              {!rates && ratesStatus === 'failed' && '暂时拿不到汇率，联网后点「刷新」'}
              {rates && ratesStatus === 'failed' && '（刷新失败，先用这份）'}
            </span>
            <button
              type="button"
              onClick={refreshRates}
              disabled={ratesStatus === 'loading'}
              className="shrink-0 rounded-full px-2 py-1 font-bold text-primary-600 disabled:opacity-50 dark:text-primary-300"
            >
              {ratesStatus === 'loading' ? '更新中…' : '刷新'}
            </button>
          </div>
        )}
        {category.kind === 'cooking' && (
          <p className="px-4 py-1.5 text-xs text-ink-mute dark:text-white/50">
            按「{ingredient.name}」估算（1 杯 ≈ {ingredient.gramsPerCup} 克），杯、匙均为美制。
          </p>
        )}
        {table && (
          <p className="px-4 py-1.5 text-xs text-ink-mute dark:text-white/50">
            最接近的尺码 · {table.note}
          </p>
        )}

        <ul>
          {orderedRows.map((item) => (
            <ResultRow key={item.unit.id} item={item} starred={stars.includes(item.unit.id)} onPick={pickRow} onCopy={copyRow} />
          ))}
        </ul>
        {!orderedRows.length && category.kind !== 'currency' && (
          <p className="px-4 py-6 text-center text-sm text-ink-mute dark:text-white/50">输入一个数开始换算</p>
        )}

        {table && (
          <div className="px-4 pb-4 pt-2">
            <button
              type="button"
              onClick={() => setShowTable((open) => !open)}
              aria-expanded={showTable}
              className="text-sm font-bold text-primary-600 dark:text-primary-300"
            >
              {showTable ? '收起完整尺码表' : '查看完整尺码表'}
            </button>
            {showTable && (
              <div className="mt-2 overflow-x-auto rounded-2xl border border-ink/10 dark:border-white/10">
                <table className="w-full text-center text-sm tabular-nums">
                  <thead className="bg-paper-deep dark:bg-white/10">
                    <tr>
                      {table.columns.map((column) => (
                        <th key={column.id} className="whitespace-nowrap px-2 py-2 font-bold">
                          {column.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {table.groups[sizeGroup].rows.map((row, index) => (
                      <tr
                        key={index}
                        onClick={() => setEntry({ input: String(row[table.columns.findIndex((c) => c.id === unitId)]).replace(/[–-].*$/, '') })}
                        className={index === results.rowIndex ? 'bg-primary-500 text-white' : 'border-t border-ink/5 dark:border-white/5'}
                      >
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex} className="whitespace-nowrap px-2 py-2">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        <p className="px-4 pb-3 pt-2 text-center text-[11px] text-ink-mute/80 dark:text-white/35">点一行换成它 · 长按复制</p>
      </main>

      {/* Keypad */}
      <footer className="pb-safe shrink-0 border-t border-ink/10 bg-paper/95 dark:border-white/10 dark:bg-[#14161a]/95">
        <button
          type="button"
          onClick={() => setKeypadOpen((open) => !open)}
          aria-expanded={keypadOpen}
          aria-label={keypadOpen ? '收起键盘' : '打开键盘'}
          className="flex h-7 w-full items-center justify-center gap-1.5 text-xs font-bold text-ink-mute dark:text-white/45"
        >
          <span className="h-1 w-9 rounded-full bg-ink/15 dark:bg-white/20" aria-hidden="true" />
          {!keypadOpen && <span>打开键盘</span>}
        </button>
        {keypadOpen && <Keypad onKey={handleKey} compound={compound} />}
      </footer>

      {toast && (
        <div role="status" className="pointer-events-none fixed inset-x-0 bottom-[45dvh] z-50 flex justify-center">
          <span className="rounded-full bg-ink px-4 py-2 text-sm font-bold text-white shadow-lg dark:bg-white dark:text-ink">{toast}</span>
        </div>
      )}

      <UnitSheet
        open={sheetOpen}
        title={`${category.label} · 输入单位`}
        units={units}
        selected={unitId}
        stars={stars}
        onSelect={(id) => {
          // Keep the same quantity: convert the current value into the new unit.
          const next = units.find((unit) => unit.id === id);
          let nextInput = input;
          if (Number.isFinite(value) && category.kind !== 'table' && category.kind !== 'currency') {
            nextInput = plainNumber(
              category.kind === 'cooking' ? convertCooking(value, inputUnit, next, ingredient) : convert(value, inputUnit, next)
            );
          } else if (table && results.rowIndex >= 0) {
            const row = table.groups[sizeGroup].rows[results.rowIndex];
            nextInput = String(row[table.columns.findIndex((column) => column.id === id)]).replace(/[–-].*$/, '');
          } else if (category.kind === 'currency' && rates && Number.isFinite(value)) {
            nextInput = plainNumber(convertCurrency(value, unitId, id, rates.rates));
          }
          setEntry({ unit: id, input: nextInput });
          setSheetOpen(false);
        }}
        onToggleStar={toggleStar}
        onClose={() => setSheetOpen(false)}
      />
      <HelpSheet open={helpOpen} onClose={() => setHelpOpen(false)} />
    </div>
  );
}
