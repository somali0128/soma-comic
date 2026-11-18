import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  DEFAULT_OPTIONS,
  PAPER_PRESETS,
  SHAPES,
  buildExportFileName,
  computeLayout,
  renderStickyNote,
} from './renderStickyNote';
import { DEFAULT_FONT_ID, STICKY_NOTE_FONTS, getStickyNoteFont, loadFontForText } from './stickyNoteFonts';
import { loadPresets, removePreset, savePresets, upsertPreset } from './stickyNotePresets';
import { VTS_GUIDE } from './vtsGuide';

const EXPORT_SIZES = [512, 768, 1024];

const DEFAULT_STATE = {
  text: DEFAULT_OPTIONS.text,
  fontId: DEFAULT_FONT_ID,
  fontSizeMode: 'auto',
  fontSize: 24,
  align: 'center',
  textColor: DEFAULT_OPTIONS.textColor,
  paper: 'yellow',
  customColor: DEFAULT_OPTIONS.customColor,
  shape: 'square',
  decoration: 'tape',
  shadow: true,
  curl: true,
  noise: true,
  rotation: -4,
};

const TEXT_COLORS = [
  { value: '#2a2522', label: '墨黑' },
  { value: '#1f4fbf', label: '钢笔蓝' },
  { value: '#c0392b', label: '红笔' },
  { value: '#6b4a2b', label: '咖啡' },
];

const DECORATION_LABELS = { none: '无', tape: '胶带', pin: '图钉', clip: '回形针' };
const ALIGN_LABELS = { left: '左', center: '中', right: '右' };

const CHECKERBOARD = {
  backgroundColor: '#ffffff',
  backgroundImage: 'repeating-conic-gradient(#ebe5d6 0% 25%, transparent 0% 50%)',
  backgroundSize: '20px 20px',
};

/* ---------- small UI pieces (follow the site's sketch styles) ---------- */

function Section({ title, children }) {
  return (
    <section className="border-t border-paper-line pt-5 first:border-t-0 first:pt-0">
      <h2 className="mb-3 text-xs font-extrabold uppercase tracking-[0.14em] text-ink-mute">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Label({ children, htmlFor }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-bold text-ink">
      {children}
    </label>
  );
}

function Segmented({ label, value, options, onChange }) {
  return (
    <div>
      <p className="mb-1.5 text-sm font-bold text-ink">{label}</p>
      <div role="radiogroup" aria-label={label} className="inline-flex flex-wrap rounded-full border-[1.5px] border-ink bg-white p-0.5">
        {options.map((option) => {
          const active = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(option.value)}
              className={`!min-h-[34px] rounded-full px-3.5 text-sm font-bold transition-colors duration-150 ${
                active ? 'bg-ink text-white' : 'text-ink-soft hover:text-ink'
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-paper-line bg-paper px-3 py-2.5">
      <span className="text-sm font-bold">{label}</span>
      <input type="checkbox" className="peer sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span
        aria-hidden="true"
        className="relative h-6 w-11 shrink-0 rounded-full border-[1.5px] border-ink bg-white transition-colors peer-checked:bg-primary-500 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary-500 after:absolute after:left-0.5 after:top-1/2 after:h-4 after:w-4 after:-translate-y-1/2 after:rounded-full after:border-[1.5px] after:border-ink after:bg-white after:transition-transform peer-checked:after:translate-x-5"
      />
    </label>
  );
}

/* ---------------------------------- page ---------------------------------- */

export default function StickyNoteGenerator() {
  const [opts, setOpts] = useState(DEFAULT_STATE);
  const [exportSize, setExportSize] = useState(768);
  const [fileName, setFileName] = useState('');
  const [presets, setPresets] = useState(loadPresets);
  const [presetName, setPresetName] = useState('');
  const [presetMessage, setPresetMessage] = useState('');
  const [fontStatus, setFontStatus] = useState('loading');
  const [renderInfo, setRenderInfo] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [previewLongEdge, setPreviewLongEdge] = useState(480);

  const canvasRef = useRef(null);
  const stageRef = useRef(null);

  const update = useCallback((patch) => setOpts((current) => ({ ...current, ...patch })), []);

  const renderOptions = useMemo(() => {
    const font = getStickyNoteFont(opts.fontId);
    return { ...opts, fontFamily: font.family, fontWeight: font.weight };
  }, [opts]);

  // Preview size follows the stage width.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width;
      setPreviewLongEdge(Math.round(Math.max(220, Math.min(560, width - 32))));
    });
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  // Render the preview once the font for the current text is ready.
  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setFontStatus((status) => (status === 'ready' ? status : 'loading'));
      const status = await loadFontForText(renderOptions.fontId, renderOptions.text);
      if (cancelled || !canvasRef.current) return;
      setFontStatus(status);
      const pixelRatio = Math.min(3, window.devicePixelRatio || 1);
      try {
        const info = renderStickyNote(canvasRef.current, { ...renderOptions, size: previewLongEdge, pixelRatio });
        canvasRef.current.style.width = `${info.width / pixelRatio}px`;
        canvasRef.current.style.height = `${info.height / pixelRatio}px`;
        setRenderInfo(info);
      } catch {
        setRenderInfo(null);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [renderOptions, previewLongEdge]);

  const exportLayout = computeLayout({ shape: opts.shape, size: exportSize, pixelRatio: 1 });

  const handleDownload = async () => {
    setIsExporting(true);
    try {
      await loadFontForText(renderOptions.fontId, renderOptions.text);
      const canvas = document.createElement('canvas');
      renderStickyNote(canvas, { ...renderOptions, size: exportSize, pixelRatio: 1 });
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
      if (!blob) throw new Error('export failed');
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = buildExportFileName(new Date(), fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } finally {
      setIsExporting(false);
    }
  };

  const handleSavePreset = () => {
    const name = presetName.trim();
    if (!name) {
      setPresetMessage('先给预设起个名字');
      return;
    }
    const next = upsertPreset(presets, name, opts);
    setPresets(next);
    setPresetName('');
    setPresetMessage(savePresets(next) ? `已保存「${name}」` : '浏览器不允许本地存储，预设只在本次打开期间有效');
  };

  const handleApplyPreset = (preset) => {
    const merged = { ...DEFAULT_STATE, ...preset.options };
    if (!STICKY_NOTE_FONTS.some((font) => font.id === merged.fontId)) merged.fontId = DEFAULT_FONT_ID;
    if (!PAPER_PRESETS[merged.paper]) merged.paper = DEFAULT_STATE.paper;
    if (!SHAPES[merged.shape]) merged.shape = DEFAULT_STATE.shape;
    setOpts(merged);
    setPresetMessage(`已切换到「${preset.name}」`);
  };

  const handleRemovePreset = (preset) => {
    const next = removePreset(presets, preset.id);
    setPresets(next);
    savePresets(next);
    setPresetMessage(`已删除「${preset.name}」`);
  };

  const statusText =
    fontStatus === 'loading'
      ? '字体加载中…'
      : fontStatus === 'failed'
        ? '字体没加载成功，暂时用系统字体显示。检查网络后改一下文字会自动重试。'
        : null;

  return (
    <div className="stickman-paper min-h-screen text-ink">
      <div className="mx-auto max-w-6xl px-4 pb-24 pt-12 sm:px-6 lg:pt-14">
        <header className="border-b-[1.5px] border-ink pb-8">
          <p className="eyebrow stickman-enter">VTS 道具小工具</p>
          <h1 className="stickman-enter-delay mt-4 font-display text-4xl font-extrabold leading-tight sm:text-5xl">VTS 便利贴生成器</h1>
          <p className="stickman-enter-delay-2 mt-4 max-w-2xl leading-relaxed text-ink-soft sm:text-lg">
            写几句话，生成一张透明背景的便利贴 PNG，放进 VTube Studio 当道具，钉在虚拟形象头上。全部在浏览器里完成，不会上传任何内容。
          </p>
        </header>

        <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)]">
          {/* Controls */}
          <div className="sketch-card order-2 space-y-5 p-5 sm:p-6 lg:order-1">
            <Section title="文字">
              <div>
                <Label htmlFor="sticky-text">内容</Label>
                <textarea
                  id="sticky-text"
                  rows={4}
                  value={opts.text}
                  onChange={(e) => update({ text: e.target.value })}
                  placeholder="写点什么…（回车可以换行）"
                  className="w-full resize-y rounded-xl border-[1.5px] border-ink bg-white px-3 py-2.5 leading-relaxed outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                />
                <p className="mt-1 text-xs text-ink-mute">回车手动换行；太长会自动换行（中文按字，英文按单词）。</p>
              </div>

              <div>
                <Label htmlFor="sticky-font">字体</Label>
                <select
                  id="sticky-font"
                  value={opts.fontId}
                  onChange={(e) => update({ fontId: e.target.value })}
                  className="w-full rounded-xl border-[1.5px] border-ink bg-white px-3 py-2.5 font-bold outline-none focus:border-primary-500"
                >
                  {STICKY_NOTE_FONTS.map((font) => (
                    <option key={font.id} value={font.id}>
                      {font.label}
                    </option>
                  ))}
                </select>
              </div>

              <Segmented
                label="字号"
                value={opts.fontSizeMode}
                onChange={(fontSizeMode) =>
                  update(
                    fontSizeMode === 'manual' && renderInfo
                      ? { fontSizeMode, fontSize: Math.round(renderInfo.fontSize) }
                      : { fontSizeMode }
                  )
                }
                options={[
                  { value: 'auto', label: '自动适配' },
                  { value: 'manual', label: '手动' },
                ]}
              />
              {opts.fontSizeMode === 'manual' && (
                <div>
                  <Label htmlFor="sticky-size">手动字号：{opts.fontSize}</Label>
                  <input
                    id="sticky-size"
                    type="range"
                    min="6"
                    max="70"
                    value={opts.fontSize}
                    onChange={(e) => update({ fontSize: Number(e.target.value) })}
                    className="w-full accent-primary-500"
                  />
                </div>
              )}

              <Segmented
                label="对齐"
                value={opts.align}
                onChange={(align) => update({ align })}
                options={Object.entries(ALIGN_LABELS).map(([value, label]) => ({ value, label }))}
              />

              <div>
                <p className="mb-1.5 text-sm font-bold">文字颜色</p>
                <div className="flex flex-wrap items-center gap-2">
                  {TEXT_COLORS.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => update({ textColor: color.value })}
                      aria-pressed={opts.textColor === color.value}
                      aria-label={color.label}
                      title={color.label}
                      className={`!min-h-[32px] !min-w-[32px] rounded-full border-[1.5px] border-ink ${
                        opts.textColor === color.value ? 'ring-2 ring-primary-500 ring-offset-2 ring-offset-white' : ''
                      }`}
                      style={{ background: color.value }}
                    />
                  ))}
                  <label className="ml-1 flex items-center gap-2 text-sm font-semibold text-ink-soft">
                    <input
                      type="color"
                      value={opts.textColor}
                      onChange={(e) => update({ textColor: e.target.value })}
                      className="h-8 w-10 cursor-pointer rounded-md border-[1.5px] border-ink bg-white p-0.5"
                    />
                    自选
                  </label>
                </div>
              </div>
            </Section>

            <Section title="纸条">
              <div>
                <p className="mb-1.5 text-sm font-bold">样式</p>
                <div className="grid grid-cols-4 gap-2">
                  {Object.entries(PAPER_PRESETS).map(([id, paper]) => {
                    const active = opts.paper === id;
                    const swatch =
                      id === 'custom'
                        ? { background: opts.customColor }
                        : id === 'notebook'
                          ? {
                              background: `linear-gradient(90deg, transparent 22%, rgba(222,72,72,.7) 22% 26%, transparent 26%), repeating-linear-gradient(180deg, ${paper.color} 0 5px, rgba(86,140,214,.55) 5px 6px)`,
                            }
                          : { background: paper.color };
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => update({ paper: id })}
                        aria-pressed={active}
                        className={`flex !min-h-0 flex-col items-center gap-1 rounded-xl border-[1.5px] p-2 text-xs font-bold transition-colors ${
                          active ? 'border-ink bg-paper shadow-sketch' : 'border-paper-line bg-white hover:border-ink'
                        }`}
                      >
                        <span className="h-7 w-7 rounded-md border border-ink/40" style={swatch} aria-hidden="true" />
                        {paper.label}
                      </button>
                    );
                  })}
                </div>
                {opts.paper === 'custom' && (
                  <label className="mt-3 flex items-center gap-2 text-sm font-semibold">
                    <input
                      type="color"
                      value={opts.customColor}
                      onChange={(e) => update({ customColor: e.target.value })}
                      className="h-8 w-10 cursor-pointer rounded-md border-[1.5px] border-ink bg-white p-0.5"
                    />
                    自定义纸张颜色
                  </label>
                )}
              </div>

              <Segmented
                label="比例"
                value={opts.shape}
                onChange={(shape) => update({ shape })}
                options={Object.entries(SHAPES).map(([value, shape]) => ({ value, label: shape.label }))}
              />

              <Segmented
                label="装饰"
                value={opts.decoration}
                onChange={(decoration) => update({ decoration })}
                options={Object.entries(DECORATION_LABELS).map(([value, label]) => ({ value, label }))}
              />
            </Section>

            <Section title="细节">
              <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-1">
                <Toggle label="轻微阴影" checked={opts.shadow} onChange={(shadow) => update({ shadow })} />
                <Toggle label="右下角卷边" checked={opts.curl} onChange={(curl) => update({ curl })} />
                <Toggle label="纸张纹理" checked={opts.noise} onChange={(noise) => update({ noise })} />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="sticky-rotation">倾斜角度：{opts.rotation}°</Label>
                  {opts.rotation !== 0 && (
                    <button type="button" onClick={() => update({ rotation: 0 })} className="!min-h-0 text-xs font-bold text-primary-600 hover:underline">
                      归零
                    </button>
                  )}
                </div>
                <input
                  id="sticky-rotation"
                  type="range"
                  min="-15"
                  max="15"
                  value={opts.rotation}
                  onChange={(e) => update({ rotation: Number(e.target.value) })}
                  className="w-full accent-primary-500"
                />
              </div>
            </Section>

            <Section title="我的预设">
              <div className="flex gap-2">
                <input
                  value={presetName}
                  onChange={(e) => setPresetName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSavePreset()}
                  placeholder="给当前样式起个名字"
                  maxLength={24}
                  aria-label="预设名称"
                  className="min-w-0 flex-1 rounded-full border-[1.5px] border-ink bg-white px-4 text-sm outline-none focus:border-primary-500"
                />
                <button type="button" onClick={handleSavePreset} className="sketch-btn shrink-0 !min-h-[40px] px-4 text-sm">
                  保存
                </button>
              </div>
              {presets.length > 0 ? (
                <ul className="flex flex-wrap gap-2">
                  {presets.map((preset) => (
                    <li key={preset.id} className="inline-flex items-center overflow-hidden rounded-full border-[1.5px] border-ink bg-white">
                      <button type="button" onClick={() => handleApplyPreset(preset)} className="!min-h-[32px] px-3 text-sm font-bold hover:bg-paper">
                        {preset.name}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemovePreset(preset)}
                        aria-label={`删除预设「${preset.name}」`}
                        className="!min-h-[32px] !min-w-[32px] border-l border-paper-line text-ink-mute hover:bg-paper hover:text-ink"
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-ink-mute">把常用的文字和样式存下来，下次一键切换。只保存在这台设备的浏览器里。</p>
              )}
              {presetMessage && (
                <p className="text-xs font-semibold text-primary-700" role="status">
                  {presetMessage}
                </p>
              )}
            </Section>
          </div>

          {/* Preview + export */}
          <div className="order-1 space-y-4 lg:sticky lg:top-24 lg:order-2">
            <div className="sketch-card overflow-hidden">
              <div className="flex items-center justify-between border-b-[1.5px] border-ink bg-white px-4 py-2.5">
                <p className="text-sm font-extrabold">实时预览</p>
                <p className="text-xs font-semibold text-ink-mute">格子 = 透明区域</p>
              </div>
              <div ref={stageRef} className="flex min-h-[320px] items-center justify-center p-4" style={CHECKERBOARD}>
                <canvas ref={canvasRef} role="img" aria-label={`便利贴预览：${opts.text}`} />
              </div>
              {(statusText || renderInfo?.overflow) && (
                <div className="space-y-1 border-t border-paper-line bg-paper px-4 py-2.5 text-xs font-semibold" role="status">
                  {statusText && <p className="text-ink-soft">{statusText}</p>}
                  {renderInfo?.overflow && (
                    <p className="text-[#b42318]">
                      {opts.fontSizeMode === 'auto'
                        ? '字太多了：已经缩到最小字号还是放不下，超出纸条的部分会被裁掉。'
                        : '字号太大，有文字超出了纸条。可以调小字号或换成自动适配。'}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="sketch-card space-y-4 p-5">
              <Segmented
                label="导出尺寸（长边）"
                value={exportSize}
                onChange={setExportSize}
                options={EXPORT_SIZES.map((size) => ({ value: size, label: `${size}` }))}
              />
              <div>
                <Label htmlFor="sticky-filename">文件名（可选）</Label>
                <input
                  id="sticky-filename"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder="留空则自动加时间戳"
                  className="w-full rounded-full border-[1.5px] border-ink bg-white px-4 py-2 text-sm outline-none focus:border-primary-500"
                />
                <p className="mt-1 text-xs text-ink-mute">
                  将保存为 <code className="font-mono text-ink">{buildExportFileName(new Date(), fileName)}</code>
                  。要在 VTS 里覆盖更新，就固定填同一个英文名。
                </p>
              </div>
              <button
                type="button"
                onClick={handleDownload}
                disabled={isExporting || fontStatus === 'loading'}
                className="sketch-btn sketch-btn--primary w-full disabled:cursor-wait disabled:opacity-60"
              >
                {isExporting ? '正在生成…' : `下载 PNG（${exportLayout.canvasWidth} × ${exportLayout.canvasHeight}）`}
              </button>
            </div>
          </div>
        </div>

        {/* VTS guide — content lives in vtsGuide.js */}
        <section aria-labelledby="vts-guide-title" className="mt-16">
          <p className="eyebrow">VTube Studio</p>
          <h2 id="vts-guide-title" className="mt-3 font-display text-3xl font-extrabold">
            {VTS_GUIDE.title}
          </h2>
          <p className="mt-2 max-w-2xl leading-relaxed text-ink-soft">{VTS_GUIDE.intro}</p>
          <ol className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {VTS_GUIDE.steps.map((step, index) => (
              <li key={step.title} className="sketch-card p-5">
                <p className="flex items-center gap-2 font-display text-lg font-extrabold">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-sm text-white">{index + 1}</span>
                  {step.title}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{step.body}</p>
                {step.code && (
                  <code className="mt-2 block break-all rounded-lg border border-paper-line bg-paper px-3 py-2 font-mono text-xs text-ink">
                    {step.code}
                  </code>
                )}
              </li>
            ))}
          </ol>
          {VTS_GUIDE.tips.length > 0 && (
            <ul className="mt-5 space-y-1.5 text-sm text-ink-soft">
              {VTS_GUIDE.tips.map((tip) => (
                <li key={tip} className="flex gap-2">
                  <span aria-hidden="true">💡</span>
                  {tip}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
