import React, { useMemo, useRef, useState } from 'react';
import './LotteryTool.css';
import './LotteryToolFixes.css';

const COPY = {
  zh: {
    modes: { wheel: '幸运转盘', random: '随机抽奖', coin: '抛硬币' },
    title: '幸运抽奖工具', subtitle: '把选择交给一点运气。名单只在你的浏览器中处理，不会上传保存。', modeLabel: '抽奖模式',
    result: '结果会出现在这里', wheelLabel: '转盘内容与权重', wheelPlaceholder: '每行：内容 | 权重', wheelHelp: '每行一项，使用“|”填写权重，最多 12 格。', spinning: '转动中…', spin: '转动转盘',
    wheelDefaults: '奶茶 | 1\n咖啡 | 2\n蛋糕 | 1\n火锅 | 3', peopleLabel: '待抽奖人员', peoplePlaceholder: '每行一个名字，也支持逗号分隔', peopleDefaults: '小明\n小红\n阿杰\nSoma\n幸运观众',
    winnerCount: '中奖人数', importList: '导入名单', recognized: (count) => `已识别 ${count} 位参与者，自动去除重复名字。`, ready: '准备好了吗？', drawing: '正在随机抽取…', startDraw: '开始 3 秒抽奖', drawDone: '开奖！',
    front: '正', back: '反', coinFlying: '硬币飞到空中…', coinResult: (side) => `结果：${side}面`, flipping: '抛掷中…', flip: '抛一次硬币',
  },
  en: {
    modes: { wheel: 'Prize Wheel', random: 'Random Draw', coin: 'Coin Flip' },
    title: 'Lucky Draw', subtitle: 'Leave the choice to chance. Your lists stay in this browser and are never uploaded.', modeLabel: 'Draw mode',
    result: 'Your result will appear here', wheelLabel: 'Wheel entries & weights', wheelPlaceholder: 'One per line: entry | weight', wheelHelp: 'Add one entry per line and use “|” for its weight. Up to 12 entries.', spinning: 'Spinning…', spin: 'Spin the wheel',
    wheelDefaults: 'Milk tea | 1\nCoffee | 2\nCake | 1\nHot pot | 3', peopleLabel: 'Participants', peoplePlaceholder: 'One name per line, or separate names with commas', peopleDefaults: 'Alex\nJamie\nTaylor\nSoma\nLucky guest',
    winnerCount: 'Number of winners', importList: 'Import list', recognized: (count) => `${count} participants found. Duplicate names are removed.`, ready: 'Ready?', drawing: 'Picking winners…', startDraw: 'Start 3-second draw', drawDone: 'Winners!',
    front: 'Heads', back: 'Tails', coinFlying: 'The coin is in the air…', coinResult: (side) => `Result: ${side}`, flipping: 'Flipping…', flip: 'Flip the coin',
  },
};

const MODE_ICONS = { wheel: '🎡', random: '🎲', coin: '🪙' };
const WHEEL_COLORS = ['#078ff2', '#ffca3a', '#ff6b6b', '#70d6a7', '#8d7cf7', '#ff9f43'];
const parseLines = (value) => value.split(/[,，\n\r]+/).map((item) => item.trim()).filter(Boolean);
const unique = (items) => [...new Set(items)];
const sample = (items, count) => {
  const pool = [...items];
  const picked = [];
  while (pool.length && picked.length < count) picked.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
  return picked;
};

function Result({ winners, copy }) {
  return <section className="lottery-result" aria-live="polite"><p className="lottery-kicker">LUCKY RESULT</p>{winners.length ? <div className="winner-list">{winners.map((winner, index) => <span key={`${winner}-${index}`}><b>{index + 1}</b>{winner}</span>)}</div> : <p className="result-placeholder">{copy.result}</p>}</section>;
}

function WheelDraw({ copy }) {
  const [entries, setEntries] = useState(copy.wheelDefaults);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState([]);
  const parsed = useMemo(() => parseLines(entries).map((line) => { const [name, weight] = line.split('|').map((x) => x.trim()); return { name, weight: Math.max(1, Number(weight) || 1) }; }).filter((x) => x.name).slice(0, 12), [entries]);
  const segments = useMemo(() => { const total = parsed.reduce((sum, entry) => sum + entry.weight, 0); let cursor = 0; return parsed.map((entry, index) => { const start = cursor; cursor += total ? entry.weight / total * 360 : 0; return { ...entry, index, start, end: cursor, mid: (start + cursor) / 2, color: WHEEL_COLORS[index % WHEEL_COLORS.length] }; }); }, [parsed]);
  const gradient = segments.length ? `conic-gradient(${segments.map((segment) => `${segment.color} ${segment.start}deg ${segment.end}deg`).join(',')})` : '#dbeafe';
  const spin = () => { if (spinning || !parsed.length) return; const totalWeight = segments.reduce((sum, entry) => sum + entry.weight, 0); let ticket = Math.random() * totalWeight; const selected = segments.find((entry) => (ticket -= entry.weight) < 0) || segments[segments.length - 1]; setSpinning(true); setWinner([]); setRotation((current) => current + 1440 + ((-selected.mid - (current % 360) + 360) % 360)); setTimeout(() => { setWinner([selected.name]); setSpinning(false); }, 3000); };
  return <div className="tool-grid"><div className="control-card"><label>{copy.wheelLabel}<textarea rows="8" value={entries} onChange={(e) => setEntries(e.target.value)} placeholder={copy.wheelPlaceholder} /></label><p className="field-help">{copy.wheelHelp}</p><button className="primary-button full" disabled={spinning} onClick={spin}>{spinning ? copy.spinning : copy.spin}</button></div><div className="wheel-stage"><div className="wheel-pointer">▼</div><div className="wheel" style={{ background: gradient, transform: `rotate(${rotation}deg)`, transitionDuration: spinning ? '3s' : '0s' }}>{segments.map((entry) => <span key={`${entry.name}-${entry.index}`} style={{ transform: `rotate(${entry.mid}deg)` }}>{entry.name}<small>×{entry.weight}</small></span>)}</div><Result winners={winner} copy={copy} /></div></div>;
}

function RandomDraw({ copy }) {
  const [people, setPeople] = useState(copy.peopleDefaults);
  const [count, setCount] = useState('1');
  const [running, setRunning] = useState(false);
  const [ticker, setTicker] = useState(copy.ready);
  const [winners, setWinners] = useState([]);
  const interval = useRef();
  const list = unique(parseLines(people));
  const importFile = (event) => { const file = event.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => setPeople(String(reader.result || '')); reader.readAsText(file); };
  const draw = () => { if (!list.length || running) return; setRunning(true); setWinners([]); interval.current = setInterval(() => setTicker(list[Math.floor(Math.random() * list.length)]), 75); setTimeout(() => { clearInterval(interval.current); const safeCount = Math.max(1, Number(count) || 1); setTicker(copy.drawDone); setWinners(sample(list, Math.min(safeCount, list.length))); setRunning(false); }, 3000); };
  return <div className="tool-grid"><div className="control-card"><label>{copy.peopleLabel}<textarea rows="9" value={people} onChange={(e) => setPeople(e.target.value)} placeholder={copy.peoplePlaceholder} /></label><div className="inline-fields"><label>{copy.winnerCount}<input type="number" min="1" max={Math.max(1, list.length)} value={count} onChange={(e) => setCount(e.target.value)} onBlur={() => setCount(String(Math.min(list.length || 1, Math.max(1, Number(count) || 1))))} /></label><label className="file-label">{copy.importList}<span className="file-control"><input aria-label={copy.importList} type="file" accept=".txt,.csv" onChange={importFile} /></span></label></div><p className="field-help">{copy.recognized(list.length)}</p><button className="primary-button full" disabled={running || !list.length} onClick={draw}>{running ? copy.drawing : copy.startDraw}</button></div><div className={running ? 'random-stage running' : 'random-stage'}><div className="ticker">{ticker}</div><Result winners={winners} copy={copy} /></div></div>;
}

function CoinFlip({ copy }) {
  const [side, setSide] = useState('front');
  const [targetSide, setTargetSide] = useState('front');
  const [flipping, setFlipping] = useState(false);
  const flip = () => { if (flipping) return; const next = Math.random() < .5 ? 'front' : 'back'; setTargetSide(next); setFlipping(true); setTimeout(() => { setSide(next); setFlipping(false); }, 1400); };
  const coinClass = `coin ${side === 'back' ? 'show-back' : ''} ${flipping ? 'flipping' : ''}`;
  const coinStyle = flipping ? { '--coin-start': side === 'back' ? '180deg' : '0deg', '--coin-end': targetSide === 'back' ? '1980deg' : '1800deg' } : undefined;
  return <div className="coin-layout"><div className={coinClass} style={coinStyle}><div className="coin-face coin-front">{copy.front}</div><div className="coin-face coin-back">{copy.back}</div></div><p className="coin-result">{flipping ? copy.coinFlying : copy.coinResult(copy[side])}</p><button className="primary-button" disabled={flipping} onClick={flip}>{flipping ? copy.flipping : copy.flip}</button></div>;
}

export default function LotteryTool({ language = 'zh' }) {
  const copy = COPY[language] || COPY.zh;
  const [mode, setMode] = useState('wheel');
  return <section className="lottery-page"><div className="lottery-shell"><header className="lottery-header"><div><p className="lottery-kicker lottery-eyebrow">SOMA'S LUCKY LAB</p><h1>{copy.title}</h1><p>{copy.subtitle}</p></div><div className="lucky-mark">LUCKY<br/><strong>★</strong></div></header><nav className="mode-tabs" aria-label={copy.modeLabel}>{Object.keys(MODE_ICONS).map((id) => <button key={id} className={mode === id ? 'active' : ''} onClick={() => setMode(id)}><span>{MODE_ICONS[id]}</span>{copy.modes[id]}</button>)}</nav><div className="mode-panel">{mode === 'wheel' && <WheelDraw copy={copy} />}{mode === 'random' && <RandomDraw copy={copy} />}{mode === 'coin' && <CoinFlip copy={copy} />}</div></div></section>;
}
