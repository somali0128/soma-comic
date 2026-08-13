import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './VocalPractice.css';

const NOTE_NAMES = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
const KEYBOARD_KEYS = ['z', 's', 'x', 'd', 'c', 'v', 'g', 'b', 'h', 'n', 'j', 'm', ',', 'l', '.', ';', '/', 'q', '2', 'w'];
const PIANO_NOTES = Array.from({ length: 20 }, (_, index) => 45 + index);
const PITCH_MIN_MIDI = 38; // D2
const PITCH_MAX_MIDI = 74; // D5

const copy = {
  zh: {
    eyebrow: 'SOMA VOCAL LAB · 每天练一点', title: '个人用音准练习工具',
    intro: '打开麦克风，唱一个舒服的长音。这里会实时告诉你正在唱什么音、偏高还是偏低，并把刚才的音高画下来。',
    start: '开始使用麦克风', stop: '停止检测', listening: '正在聆听', idle: '等待开始',
    micHint: '音频只在你的浏览器中分析，不会上传或保存。建议佩戴耳机。',
    current: '当前音高', target: '目标音', accuracy: '音准', cents: '音分', frequency: '频率',
    low: '偏低', high: '偏高', inTune: '很准', quiet: '唱一个稳定的音…',
    trace: '刚才的音高', traceHint: '显示最近约 20 秒 · 纵轴固定为 D2—D5',
    routine: '今日发声练习', routineHint: '轻声、放松，舒服比音量更重要。', done: '完成今日练习', completed: '今天已完成', streak: '连续练习', days: '天',
    steps: ['唇颤音 · 1 分钟', '哼鸣滑音 · 2 分钟', '五声音阶 · 3 分钟'],
    keyboard: '模拟键盘', keyboardHint: '按住琴键持续发声，松开停止；也可使用琴键上标注的电脑按键。',
    permission: '无法读取麦克风。请在浏览器地址栏允许麦克风权限后重试。', unsupported: '这个浏览器暂不支持麦克风音高检测。',
  },
  en: {
    eyebrow: 'SOMA VOCAL LAB · A LITTLE EVERY DAY', title: 'Personal pitch practice tool',
    intro: 'Turn on your microphone and sustain a comfortable note. See what you are singing, whether it is sharp or flat, and how your pitch moved.',
    start: 'Start microphone', stop: 'Stop listening', listening: 'Listening now', idle: 'Ready when you are',
    micHint: 'Audio is analysed only in your browser—it is never uploaded or saved. Headphones are recommended.',
    current: 'Current pitch', target: 'Target note', accuracy: 'Accuracy', cents: 'cents', frequency: 'Frequency',
    low: 'Flat', high: 'Sharp', inTune: 'In tune', quiet: 'Sing a steady note…',
    trace: 'Recent pitch', traceHint: 'About 20 seconds · fixed D2—D5 vertical range',
    routine: "Today's warm-up", routineHint: 'Stay gentle and relaxed. Comfort matters more than volume.', done: 'Finish today', completed: 'Done for today', streak: 'Practice streak', days: 'days',
    steps: ['Lip trill · 1 min', 'Humming sirens · 2 min', 'Five-note scales · 3 min'],
    keyboard: 'Practice piano', keyboardHint: 'Press and hold a piano key to sustain it; release to stop. Computer-key shortcuts are shown on the keys.',
    permission: 'Microphone access failed. Allow it in your browser address bar, then try again.', unsupported: 'This browser does not support microphone pitch detection.',
  },
};

function midiToNote(midi) { return `${NOTE_NAMES[((midi % 12) + 12) % 12]}${Math.floor(midi / 12) - 1}`; }
function frequencyToMidi(frequency) { return 69 + 12 * Math.log2(frequency / 440); }
function midiToFrequency(midi) { return 440 * (2 ** ((midi - 69) / 12)); }

function detectPitchYin(buffer, sampleRate, differenceBuffer) {
  let rms = 0;
  for (let i = 0; i < buffer.length; i += 1) rms += buffer[i] * buffer[i];
  rms = Math.sqrt(rms / buffer.length);
  if (rms < 0.012) return null;

  const minLag = Math.max(2, Math.floor(sampleRate / midiToFrequency(PITCH_MAX_MIDI)));
  const maxLag = Math.min(
    Math.ceil(sampleRate / midiToFrequency(PITCH_MIN_MIDI)),
    Math.floor(buffer.length / 2),
  );
  const comparisonLength = buffer.length - maxLag;

  differenceBuffer.fill(0, 0, maxLag + 1);
  for (let lag = 1; lag <= maxLag; lag += 1) {
    let difference = 0;
    for (let i = 0; i < comparisonLength; i += 1) {
      const delta = buffer[i] - buffer[i + lag];
      difference += delta * delta;
    }
    differenceBuffer[lag] = difference;
  }

  differenceBuffer[0] = 1;
  let runningSum = 0;
  for (let lag = 1; lag <= maxLag; lag += 1) {
    runningSum += differenceBuffer[lag];
    differenceBuffer[lag] = runningSum === 0 ? 1 : (differenceBuffer[lag] * lag) / runningSum;
  }

  const threshold = 0.14;
  let selectedLag = -1;
  for (let lag = minLag; lag <= maxLag; lag += 1) {
    if (differenceBuffer[lag] < threshold) {
      selectedLag = lag;
      while (selectedLag + 1 <= maxLag && differenceBuffer[selectedLag + 1] < differenceBuffer[selectedLag]) selectedLag += 1;
      break;
    }
  }
  if (selectedLag < 0 || 1 - differenceBuffer[selectedLag] < 0.82) return null;

  const before = differenceBuffer[Math.max(1, selectedLag - 1)];
  const center = differenceBuffer[selectedLag];
  const after = differenceBuffer[Math.min(maxLag, selectedLag + 1)];
  const denominator = before - (2 * center) + after;
  const adjustment = Math.abs(denominator) < 1e-6 ? 0 : 0.5 * (before - after) / denominator;
  const refinedLag = selectedLag + Math.max(-0.5, Math.min(0.5, adjustment));
  return sampleRate / refinedLag;
}

function PitchTrace({ points, targetMidi }) {
  const width = 1200; const height = 280;
  const plotLeft = 58; const plotRight = width - 14; const plotTop = 14; const plotBottom = height - 18;
  const min = PITCH_MIN_MIDI; const max = PITCH_MAX_MIDI;
  const yForMidi = (midi) => plotBottom - ((midi - min) / (max - min)) * (plotBottom - plotTop);
  const path = points.map((value, index) => {
    if (!value) return null;
    const x = plotLeft + (index / Math.max(points.length - 1, 1)) * (plotRight - plotLeft);
    const y = yForMidi(Math.max(min, Math.min(max, value)));
    return `${index === 0 || !points[index - 1] ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
  }).filter(Boolean).join(' ');
  const targetY = yForMidi(targetMidi);
  const scaleNotes = [PITCH_MAX_MIDI, 62, 50, PITCH_MIN_MIDI];
  return <svg className="pitch-trace" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Pitch history graph">
    {scaleNotes.map((midi) => <g key={midi}><line x1={plotLeft} x2={plotRight} y1={yForMidi(midi)} y2={yForMidi(midi)} className="trace-grid" /><text x="12" y={yForMidi(midi) + 5} className="trace-label">{midiToNote(midi)}</text></g>)}
    {targetY >= plotTop && targetY <= plotBottom && <line x1={plotLeft} x2={plotRight} y1={targetY} y2={targetY} className="trace-target" />}
    <path d={path} className="trace-line" />
  </svg>;
}

export default function VocalPractice({ language = 'zh' }) {
  const t = copy[language] || copy.zh;
  const [isListening, setIsListening] = useState(false);
  const [frequency, setFrequency] = useState(null);
  const [lastFrequency, setLastFrequency] = useState(null);
  const [pitchPoints, setPitchPoints] = useState(Array(625).fill(null));
  const [targetMidi, setTargetMidi] = useState(60);
  const [error, setError] = useState('');
  const [activeMidi, setActiveMidi] = useState(null);
  const [completed, setCompleted] = useState(() => localStorage.getItem('vocal-practice-last') === new Date().toISOString().slice(0, 10));
  const [streak, setStreak] = useState(() => Number(localStorage.getItem('vocal-practice-streak') || 0));
  const audioContextRef = useRef(null); const streamRef = useRef(null); const frameRef = useRef(null); const oscillatorRef = useRef(null);
  const recentFrequenciesRef = useRef([]); const quietFramesRef = useRef(0);

  const currentMidiFloat = frequency ? frequencyToMidi(frequency) : null;
  const displayedFrequency = frequency || lastFrequency;
  const displayedMidiFloat = displayedFrequency ? frequencyToMidi(displayedFrequency) : null;
  const nearestMidi = displayedMidiFloat === null ? null : Math.round(displayedMidiFloat);
  const cents = currentMidiFloat === null ? null : Math.round((currentMidiFloat - nearestMidi) * 100);
  const status = cents === null ? t.quiet : Math.abs(cents) <= 10 ? t.inTune : cents < 0 ? t.low : t.high;

  const stopListening = useCallback(() => {
    cancelAnimationFrame(frameRef.current);
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null; setIsListening(false); setFrequency(null);
  }, []);

  useEffect(() => () => {
    stopListening();
    try { oscillatorRef.current?.oscillator.stop(); } catch (_) {}
    audioContextRef.current?.close();
  }, [stopListening]);

  const startListening = async () => {
    setError('');
    if (!navigator.mediaDevices?.getUserMedia || !window.AudioContext) { setError(t.unsupported); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } });
      const context = audioContextRef.current || new AudioContext(); audioContextRef.current = context;
      if (context.state === 'suspended') await context.resume();
      const analyser = context.createAnalyser(); analyser.fftSize = 2048; analyser.smoothingTimeConstant = 0;
      context.createMediaStreamSource(stream).connect(analyser); streamRef.current = stream;
      const buffer = new Float32Array(analyser.fftSize); const differenceBuffer = new Float32Array(Math.floor(analyser.fftSize / 2) + 1);
      recentFrequenciesRef.current = []; quietFramesRef.current = 0; setIsListening(true);
      let lastDetection = 0;
      const detect = (time) => {
        if (time - lastDetection < 32) {
          frameRef.current = requestAnimationFrame(detect);
          return;
        }
        lastDetection = time;
        analyser.getFloatTimeDomainData(buffer);
        const detected = detectPitchYin(buffer, context.sampleRate, differenceBuffer);
        const inRange = detected && detected >= midiToFrequency(PITCH_MIN_MIDI) && detected <= midiToFrequency(PITCH_MAX_MIDI) ? detected : null;
        if (inRange) {
          quietFramesRef.current = 0;
          recentFrequenciesRef.current = [...recentFrequenciesRef.current.slice(-4), inRange];
        } else {
          quietFramesRef.current += 1;
          if (quietFramesRef.current > 8) recentFrequenciesRef.current = [];
        }
        const sorted = [...recentFrequenciesRef.current].sort((a, b) => a - b);
        const validFrequency = inRange && sorted.length ? sorted[Math.floor(sorted.length / 2)] : null;
        setFrequency(validFrequency);
        if (validFrequency) setLastFrequency(validFrequency);
        const midi = validFrequency ? frequencyToMidi(validFrequency) : null;
        setPitchPoints((previous) => [...previous.slice(1), midi]);
        frameRef.current = requestAnimationFrame(detect);
      };
      frameRef.current = requestAnimationFrame(detect);
    } catch { setError(t.permission); setIsListening(false); }
  };

  const stopNote = useCallback((midi) => {
    const voice = oscillatorRef.current;
    if (!voice || (midi !== undefined && voice.midi !== midi)) return;
    const now = voice.context.currentTime;
    voice.gain.gain.cancelScheduledValues(now);
    voice.gain.gain.setValueAtTime(Math.max(voice.gain.gain.value, 0.0001), now);
    voice.gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);
    try { voice.oscillator.stop(now + 0.07); } catch (_) {}
    oscillatorRef.current = null;
    setActiveMidi(null);
  }, []);

  const startNote = useCallback(async (midi) => {
    const context = audioContextRef.current || new AudioContext(); audioContextRef.current = context;
    if (context.state === 'suspended') await context.resume();
    if (oscillatorRef.current) stopNote();
    const oscillator = context.createOscillator(); const gain = context.createGain();
    oscillator.type = 'triangle'; oscillator.frequency.value = 440 * (2 ** ((midi - 69) / 12));
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.2, context.currentTime + 0.025);
    oscillator.connect(gain).connect(context.destination); oscillator.start();
    oscillatorRef.current = { oscillator, gain, context, midi };
    setActiveMidi(midi); setTargetMidi(midi);
  }, [stopNote]);

  const playReferenceNote = useCallback(async (midi) => {
    await startNote(midi);
    window.setTimeout(() => stopNote(midi), 900);
  }, [startNote, stopNote]);

  useEffect(() => {
    const onKeyDown = (event) => {
      const index = KEYBOARD_KEYS.indexOf(event.key.toLowerCase());
      if (index >= 0 && !event.repeat) { event.preventDefault(); startNote(PIANO_NOTES[index]); }
    };
    const onKeyUp = (event) => {
      const index = KEYBOARD_KEYS.indexOf(event.key.toLowerCase());
      if (index >= 0) { event.preventDefault(); stopNote(PIANO_NOTES[index]); }
    };
    const onBlur = () => stopNote();
    window.addEventListener('keydown', onKeyDown); window.addEventListener('keyup', onKeyUp); window.addEventListener('blur', onBlur);
    return () => { window.removeEventListener('keydown', onKeyDown); window.removeEventListener('keyup', onKeyUp); window.removeEventListener('blur', onBlur); };
  }, [startNote, stopNote]);

  const finishPractice = () => {
    if (completed) return;
    const today = new Date(); const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
    const last = localStorage.getItem('vocal-practice-last'); const nextStreak = last === yesterday.toISOString().slice(0, 10) ? streak + 1 : 1;
    localStorage.setItem('vocal-practice-last', today.toISOString().slice(0, 10)); localStorage.setItem('vocal-practice-streak', String(nextStreak));
    setStreak(nextStreak); setCompleted(true);
  };

  const keys = useMemo(() => PIANO_NOTES.map((midi, index) => ({ midi, label: midiToNote(midi), shortcut: KEYBOARD_KEYS[index], black: NOTE_NAMES[midi % 12].includes('♯') })), []);

  return <section className="vocal-lab min-h-screen px-4 pb-20 pt-24 text-slate-950 sm:px-6">
    <div className="mx-auto max-w-6xl">
      <header className="vocal-hero">
        <div><p className="font-display text-sm font-black tracking-[.18em] text-primary-700">{t.eyebrow}</p><h1 className="font-display mt-3 text-5xl font-black leading-[.98] sm:text-7xl">{t.title}</h1><p className="mt-5 max-w-2xl text-base font-bold leading-7 text-slate-600">{t.intro}</p></div>
        <div className="mic-orbit" aria-hidden><span>♪</span><i /><b /></div>
      </header>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.45fr_.75fr]">
        <section className="vocal-card pitch-console">
          <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="vocal-label">{t.current}</p><p className="mt-1 text-sm font-extrabold text-slate-500">{isListening ? `● ${t.listening}` : t.idle}</p></div><button className={`mic-button ${isListening ? 'is-live' : ''}`} onClick={isListening ? stopListening : startListening}>{isListening ? t.stop : t.start}</button></div>
          <div className="pitch-readout">
            <div><span className="note-name">{nearestMidi === null ? '—' : midiToNote(nearestMidi)}</span><span className="frequency">{frequency ? `${frequency.toFixed(1)} Hz` : lastFrequency ? `${lastFrequency.toFixed(1)} Hz` : t.quiet}</span></div>
            <div className={`tune-badge ${cents !== null && Math.abs(cents) <= 10 ? 'perfect' : ''}`}><strong>{status}</strong><span>{cents === null ? '—' : `${cents > 0 ? '+' : ''}${cents} ${t.cents}`}</span></div>
          </div>
          <div className="tune-meter" aria-label={`${t.accuracy}: ${status}`}><span className="meter-flat">♭</span><div className="meter-track"><i className="meter-center" /><b style={{ left: `${cents === null ? 50 : Math.max(3, Math.min(97, 50 + cents / 2))}%` }} /></div><span className="meter-sharp">♯</span></div>
          <div className="target-row"><span>{t.target}</span><button onClick={() => playReferenceNote(targetMidi)}>▶ {midiToNote(targetMidi)}</button><small>{t.frequency}: {(440 * (2 ** ((targetMidi - 69) / 12))).toFixed(1)} Hz</small></div>
          {error && <p className="mic-error" role="alert">{error}</p>}<p className="privacy-note">◉ {t.micHint}</p>
        </section>

        <aside className="vocal-card routine-card"><div className="flex items-start justify-between gap-4"><div><p className="vocal-label">{t.routine}</p><p className="mt-2 text-sm font-bold leading-6 text-slate-500">{t.routineHint}</p></div><div className="streak"><strong>{streak}</strong><span>{t.days}<br />{t.streak}</span></div></div><ol>{t.steps.map((step, index) => <li key={step}><span>{index + 1}</span>{step}</li>)}</ol><button className={`finish-button ${completed ? 'is-complete' : ''}`} onClick={finishPractice} disabled={completed}>{completed ? `✓ ${t.completed}` : t.done}</button></aside>
      </div>

      <section className="vocal-card mt-6 overflow-hidden"><div className="trace-heading"><div><p className="vocal-label">{t.trace}</p><p>{t.traceHint}</p></div><span>{nearestMidi === null ? midiToNote(targetMidi) : midiToNote(nearestMidi)}</span></div><PitchTrace points={pitchPoints} targetMidi={targetMidi} /></section>

      <section className="vocal-card mt-6"><div className="keyboard-heading"><div><p className="vocal-label">{t.keyboard}</p><p>{t.keyboardHint}</p></div><div className="target-pill">A2—E4 · {t.target} {midiToNote(targetMidi)}</div></div><div className="piano-scroll"><div className="piano">{keys.filter((key) => !key.black).map((key) => <button key={key.midi} className={`white-key ${activeMidi === key.midi ? 'active' : ''}`} onPointerDown={(event) => { event.preventDefault(); event.currentTarget.setPointerCapture?.(event.pointerId); startNote(key.midi); }} onPointerUp={() => stopNote(key.midi)} onPointerCancel={() => stopNote(key.midi)} aria-label={key.label}><span>{key.label}<small>{key.shortcut.toUpperCase()}</small></span></button>)}{keys.filter((key) => key.black).map((key) => { const whiteBefore = PIANO_NOTES.slice(0, PIANO_NOTES.indexOf(key.midi)).filter((m) => !NOTE_NAMES[m % 12].includes('♯')).length; return <button key={key.midi} style={{ left: `${whiteBefore * 72 - 20}px` }} className={`black-key ${activeMidi === key.midi ? 'active' : ''}`} onPointerDown={(event) => { event.preventDefault(); event.currentTarget.setPointerCapture?.(event.pointerId); startNote(key.midi); }} onPointerUp={() => stopNote(key.midi)} onPointerCancel={() => stopNote(key.midi)} aria-label={key.label}><span>{key.label}<small>{key.shortcut.toUpperCase()}</small></span></button>; })}</div></div></section>
    </div>
  </section>;
}
