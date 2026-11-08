import React from 'react';
import { Link } from 'react-router-dom';

const Tools = ({ t }) => {
  const { eyebrow, title, subtitle, items } = t.toolsPage;
  const isZh = t.social.locale === 'zh';

  const tools = [
    {
      id: 'vocal', icon: '♫', accent: 'bg-primary-100', to: '/vocal-practice',
      title: isZh ? '声乐练习室' : 'Vocal Practice Lab',
      status: isZh ? '麦克风工具 · 实时音高' : 'Microphone tool · live pitch',
      description: isZh ? '用实时音高轨迹、音准偏差提示和模拟钢琴，完成每天几分钟的发声练习。' : 'Warm up with a live pitch trace, tuning feedback, target notes, and an interactive piano.',
      details: isZh ? ['实时音高检测', '每日练习打卡', '两组八度钢琴'] : ['Live pitch detection', 'Daily practice streak', 'Two-octave piano'],
    },
    {
      id: 'lottery', icon: '🎯', accent: 'bg-[#fff1c7]', to: '/lottery',
      title: isZh ? '幸运抽奖工具' : 'Lucky Draw',
      status: isZh ? '站内工具 · 即开即用' : 'On-site tool · ready to use',
      description: isZh ? '转盘、随机名单与硬币三种抽选方式，适合直播、活动和日常决策。' : 'A playful raffle desk with a wheel, random list, and coin flip for streams, events, and everyday decisions.',
      details: isZh ? ['三种抽选模式', '支持权重和名单导入', '动画结果展示'] : ['Three draw modes', 'Weighted entries and imports', 'Animated, clear results'],
    },
    {
      id: 'menu', icon: '🍜', accent: 'bg-[#dcf5e8]', to: '/order-menu',
      title: isZh ? '今天吃什么' : 'What Should We Eat?',
      status: isZh ? '站内工具 · 家庭菜单' : 'On-site tool · family menu',
      description: isZh ? '把“今天吃什么”变成一个轻松的点菜流程，收集想法、确认菜品。' : 'Turn the daily “what should we eat?” question into a lightweight family ordering flow.',
      details: isZh ? ['菜单分类与筛选', '点菜清单', '手机端优先'] : ['Menu categories and filters', 'Shared order list', 'Mobile-first experience'],
    },
    {
      id: 'dream-world', icon: '✦', accent: 'bg-[#e7e3ff]', to: '/dream-world',
      title: isZh ? '梦境世界' : 'Dream World',
      status: isZh ? '像素叙事实验 · 准备中' : 'Pixel narrative · in preparation',
      description: isZh ? '把记得的梦拼成一张可以探索的地图，让访客通过角色、NPC 与梦境碎片了解这个世界。' : 'A walkable world assembled from remembered dreams, told through characters, NPCs, and collectible fragments.',
      details: isZh ? ['2D 像素探索', 'NPC 对话', '梦境碎片图鉴'] : ['2D pixel exploration', 'NPC conversations', 'Dream fragment archive'],
    },
  ];

  const projects = [
    { id: 'clock', icon: '◷', href: 'https://github.com/somali0128/clock-widget-qiu', ...items.clock },
    { id: 'orderMenu', icon: '☕', href: 'https://github.com/somali0128/wechat-order-menu', ...items.orderMenu },
    { id: 'heartRateBattle', icon: '♥', href: 'https://github.com/somali0128/heart-rate-battle', ...items.heartRateBattle },
  ];

  return (
    <div className="stickman-paper min-h-screen text-ink">
      <div className="mx-auto max-w-6xl px-4 pb-24 pt-12 sm:px-6 lg:pt-16">
        <header className="grid gap-8 border-b-[1.5px] border-ink pb-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="eyebrow stickman-enter">{eyebrow}</p>
            <h1 className="stickman-enter-delay mt-4 font-display text-5xl font-extrabold leading-none sm:text-6xl">{title}</h1>
            <p className="stickman-enter-delay-2 mt-5 max-w-2xl text-base leading-relaxed text-ink-soft sm:text-lg">{subtitle}</p>
          </div>
          <dl className="stickman-enter-delay-2 grid grid-cols-2 overflow-hidden rounded-[14px] border-[1.5px] border-ink bg-white shadow-sketch">
            <div className="px-6 py-4">
              <dt className="text-xs font-bold text-ink-mute">{isZh ? '站内工具' : 'On-site tools'}</dt>
              <dd className="font-display text-4xl font-extrabold text-primary-600">{String(tools.length).padStart(2, '0')}</dd>
            </div>
            <div className="border-l-[1.5px] border-ink px-6 py-4">
              <dt className="text-xs font-bold text-ink-mute">{isZh ? '开源作品' : 'Open-source'}</dt>
              <dd className="font-display text-4xl font-extrabold">{String(projects.length).padStart(2, '0')}</dd>
            </div>
          </dl>
        </header>

        <section aria-labelledby="tools-heading" className="pt-12">
          <h2 id="tools-heading" className="eyebrow">{isZh ? '站内工具 · 打开就能用' : 'On-site tools · ready to use'}</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {tools.map((tool) => (
              <Link key={tool.id} to={tool.to} className="sketch-card sketch-link group flex flex-col p-6 sm:p-7">
                <div className="flex items-start justify-between gap-4">
                  <span className={`flex h-12 w-12 items-center justify-center rounded-full border-[1.5px] border-ink text-xl ${tool.accent}`} aria-hidden="true">{tool.icon}</span>
                  <span className="sketch-chip">{tool.status}</span>
                </div>
                <h3 className="mt-6 font-display text-2xl font-extrabold sm:text-[1.75rem]">{tool.title}</h3>
                <p className="mt-2 flex-1 leading-relaxed text-ink-soft">{tool.description}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {tool.details.map((detail) => <li key={detail} className="sketch-chip">{detail}</li>)}
                </ul>
                <p className="mt-6 flex items-center gap-2 border-t border-paper-line pt-4 text-sm font-extrabold text-primary-600">
                  {t.toolsPage.useNow}
                  <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section id="projects" aria-labelledby="projects-heading" className="scroll-mt-24 pt-20">
          <p className="eyebrow">{t.toolsPage.projectsEyebrow}</p>
          <h2 id="projects-heading" className="mt-3 max-w-3xl font-display text-3xl font-extrabold leading-tight sm:text-4xl">{t.toolsPage.projectsTitle}</h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-ink-soft">{t.toolsPage.projectsSubtitle}</p>
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {projects.map((project, index) => (
              <a key={project.id} href={project.href} target="_blank" rel="noopener noreferrer" className="sketch-card sketch-link group flex h-full flex-col p-6">
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border-[1.5px] border-ink bg-paper text-xl" aria-hidden="true">{project.icon}</span>
                  <span className="font-display text-sm font-bold text-ink-mute">{String(index + 1).padStart(2, '0')}</span>
                </div>
                <h3 className="mt-5 font-display text-xl font-extrabold sm:text-2xl">{project.title}</h3>
                <p className="mt-1 text-xs font-bold uppercase tracking-wide text-primary-600">{project.status}</p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">{project.description}</p>
                <p className="mt-6 flex items-center gap-1.5 border-t border-paper-line pt-4 text-sm font-extrabold">
                  {t.toolsPage.viewSource}
                  <span aria-hidden="true" className="text-ink-mute transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
                  <span className="sr-only">(GitHub)</span>
                </p>
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Tools;
