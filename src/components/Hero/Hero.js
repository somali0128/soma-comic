import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const PANEL_IMAGES = {
  comics:
    'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?auto=format&fit=crop&w=1600&q=80',
  social:
    'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1600&q=80',
  tools:
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&h=900&q=80',
};

const Hero = ({ t }) => {
  const { panels: p } = t.hero;
  const panelList = [
    {
      id: 'comics',
      to: '/comics',
      title: p.comics.title,
      image: PANEL_IMAGES.comics,
    },
    {
      id: 'social',
      to: '/social',
      title: p.social.title,
      image: PANEL_IMAGES.social,
    },
    {
      id: 'tools',
      to: '/order-menu',
      title: p.tools.title,
      image: PANEL_IMAGES.tools,
    },
  ];

  const [hovered, setHovered] = useState(null);

  /** 未 hover：三等分；hover 某列：该列 flex-grow 2（约 50%），其余各 25% */
  const flexClass = (i) => {
    if (hovered === null) return 'flex-[1_1_0%]';
    return hovered === i ? 'flex-[2_1_0%]' : 'flex-[1_1_0%]';
  };

  return (
    <section className="relative min-h-screen min-h-[100dvh] w-full overflow-hidden bg-neutral-950">
      {/* 桌面：三块长方形；hover 时 50% / 25% / 25%，左向右扩、中双向、右向左扩（由 flex 自然实现） */}
      <div className="hidden h-screen h-[100dvh] min-h-[420px] w-full md:flex md:flex-row md:gap-0">
        {panelList.map((panel, i) => (
          <Link
            key={panel.id}
            to={panel.to}
            aria-label={panel.title}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            className={`group relative min-h-0 min-w-0 overflow-hidden border-amber-400/80 bg-neutral-900 transition-[flex] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] first:border-l-0 ${flexClass(
              i
            )} border-l-2`}
          >
            <img
              src={panel.image}
              alt=""
              className="absolute inset-0 h-full w-full object-cover object-center brightness-[0.88] transition-all duration-500 ease-out group-hover:scale-105 group-hover:brightness-100"
              loading={i === 0 ? 'eager' : 'lazy'}
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent transition-opacity duration-500 group-hover:from-black/90"
              aria-hidden
            />
            <div className="absolute inset-x-0 bottom-0 z-10 px-5 pb-8 pt-12 sm:px-7 sm:pb-10">
              <h2 className="hero-panel-title text-balance text-xl font-black tracking-tight text-white transition-transform duration-500 group-hover:translate-y-[-2px] sm:text-2xl lg:text-3xl xl:text-4xl">
                {panel.title}
              </h2>
            </div>
          </Link>
        ))}
      </div>

      {/* 移动端：三等分纵向长方形 */}
      <div className="flex h-screen h-[100dvh] min-h-[360px] flex-col md:hidden">
        {panelList.map((panel, i) => (
          <Link
            key={panel.id}
            to={panel.to}
            aria-label={panel.title}
            className="relative min-h-0 flex-1 overflow-hidden border-b-2 border-amber-400/80 bg-neutral-900 last:border-b-0"
          >
            <img
              src={panel.image}
              alt=""
              className="absolute inset-0 h-full w-full object-cover object-center brightness-[0.88]"
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent"
              aria-hidden
            />
            <div className="absolute inset-x-0 bottom-0 z-10 px-4 pb-4 pt-10">
              <h2 className="hero-panel-title text-lg font-bold text-white">
                {panel.title}
              </h2>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Hero;
