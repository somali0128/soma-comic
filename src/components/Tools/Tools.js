import React from 'react';
import { Link } from 'react-router-dom';

const Tools = ({ t }) => {
  const { eyebrow, title, subtitle, items } = t.toolsPage;
  const isZh = t.social.locale === 'zh';

  const tools = [
    {
      id: 'vocal', icon: '♫', accent: 'bg-sky-100', to: '/vocal-practice',
      title: isZh ? '声乐练习室' : 'Vocal Practice Lab',
      status: isZh ? '麦克风工具 · 实时音高' : 'Microphone tool · live pitch',
      description: isZh ? '用实时音高轨迹、音准偏差提示和模拟钢琴，完成每天几分钟的发声练习。' : 'Warm up with a live pitch trace, tuning feedback, target notes, and an interactive piano.',
      details: isZh ? ['实时音高检测', '每日练习打卡', '两组八度钢琴'] : ['Live pitch detection', 'Daily practice streak', 'Two-octave piano'],
    },
    {
      id: 'lottery', icon: '🎯', accent: 'bg-amber-100', to: '/lottery',
      title: isZh ? '幸运抽奖工具' : 'Lucky Draw',
      status: isZh ? '站内工具 · 即开即用' : 'On-site tool · ready to use',
      description: isZh ? '转盘、随机名单与硬币三种抽选方式，适合直播、活动和日常决策。' : 'A playful raffle desk with a wheel, random list, and coin flip for streams, events, and everyday decisions.',
      details: isZh ? ['三种抽选模式', '支持权重和名单导入', '动画结果展示'] : ['Three draw modes', 'Weighted entries and imports', 'Animated, clear results'],
    },
    {
      id: 'menu', icon: '🍜', accent: 'bg-emerald-100', to: '/order-menu',
      title: isZh ? '今天吃什么' : 'What Should We Eat?',
      status: isZh ? '站内工具 · 家庭菜单' : 'On-site tool · family menu',
      description: isZh ? '把“今天吃什么”变成一个轻松的点菜流程，收集想法、确认菜品。' : 'Turn the daily “what should we eat?” question into a lightweight family ordering flow.',
      details: isZh ? ['菜单分类与筛选', '点菜清单', '手机端优先'] : ['Menu categories and filters', 'Shared order list', 'Mobile-first experience'],
    },
  ];

  const projects = [
    { id: 'clock', icon: '◷', href: 'https://github.com/somali0128/clock-widget-qiu', ...items.clock },
    { id: 'orderMenu', icon: '☕', href: 'https://github.com/somali0128/wechat-order-menu', ...items.orderMenu },
    { id: 'heartRateBattle', icon: '♥', href: 'https://github.com/somali0128/heart-rate-battle', ...items.heartRateBattle },
  ];

  return (
    <section className="stickman-paper min-h-screen px-4 pb-20 pt-24 text-slate-950 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 grid gap-6 border-b-[3px] border-slate-950 pb-9 lg:grid-cols-[1fr_280px] lg:items-end">
          <div>
            <p className="stickman-enter font-display text-sm font-black uppercase tracking-[0.18em] text-primary-700">{eyebrow}</p>
            <h1 className="stickman-enter-delay mt-3 font-display text-5xl font-black leading-none text-primary-700 sm:text-6xl">{title}</h1>
            <p className="stickman-enter-delay-2 mt-5 max-w-2xl text-base font-bold leading-7 text-slate-700">{subtitle}</p>
          </div>
          <div className="rounded-md border-[3px] border-slate-950 bg-primary-600 p-5 text-white shadow-[6px_6px_0_#071b34]">
            <p className="font-display text-4xl font-black">03</p>
            <p className="mt-1 text-sm font-extrabold">{isZh ? '个可直接使用的站内工具' : 'tools you can use right here'}</p>
          </div>
        </header>

        <div className="grid gap-5 md:grid-cols-2">
          {tools.map((tool) => (
            <Link key={tool.id} to={tool.to} className="stickman-card-blue stickman-pop group rounded-md bg-white p-6 transition hover:-translate-y-1 sm:p-7">
              <div className={`flex h-14 w-14 items-center justify-center rounded-md border-[3px] border-slate-950 text-2xl ${tool.accent}`}>{tool.icon}</div>
              <p className="mt-6 text-xs font-black uppercase tracking-[0.16em] text-primary-700">{tool.status}</p>
              <h2 className="mt-2 font-display text-3xl font-black">{tool.title}</h2>
              <p className="mt-3 font-semibold leading-7 text-slate-600">{tool.description}</p>
              <ul className="mt-5 flex flex-wrap gap-2">{tool.details.map((detail) => <li key={detail} className="rounded border-2 border-primary-200 bg-primary-50 px-3 py-1 text-xs font-extrabold text-primary-800">{detail}</li>)}</ul>
              <p className="mt-7 font-display font-black text-primary-700 group-hover:translate-x-1 transition-transform">{t.toolsPage.useNow} →</p>
            </Link>
          ))}
        </div>

        <section id="projects" className="scroll-mt-24 pt-20">
          <p className="font-display text-sm font-black uppercase tracking-[0.18em] text-primary-700">{t.toolsPage.projectsEyebrow}</p>
          <h2 className="mt-3 max-w-3xl font-display text-4xl font-black leading-tight sm:text-5xl">{t.toolsPage.projectsTitle}</h2>
          <p className="mt-4 max-w-2xl font-semibold leading-7 text-slate-600">{t.toolsPage.projectsSubtitle}</p>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {projects.map((project, index) => (
              <a key={project.id} href={project.href} target="_blank" rel="noopener noreferrer" className="stickman-pop flex h-full flex-col rounded-md border-[3px] border-slate-950 bg-white p-5 shadow-[5px_5px_0_rgba(7,27,52,.16)] transition hover:-translate-y-1">
                <div className="flex items-center justify-between"><span className="text-3xl" aria-hidden>{project.icon}</span><span className="font-display text-sm font-black text-primary-300">0{index + 1}</span></div>
                <h3 className="mt-5 font-display text-2xl font-black">{project.title}</h3>
                <p className="mt-2 text-xs font-black uppercase tracking-wide text-primary-700">{project.status}</p>
                <p className="mt-4 flex-1 text-sm font-semibold leading-6 text-slate-600">{project.description}</p>
                <p className="mt-6 font-display text-sm font-black text-primary-700">{t.toolsPage.viewSource} ↗</p>
              </a>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
};

export default Tools;

