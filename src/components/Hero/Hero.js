import React from 'react';
import { Link } from 'react-router-dom';
import somaIllustration from '../../assets/soma-ip.webp';

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

const icons = {
  tools: (
    <svg viewBox="0 0 48 48" aria-hidden="true" {...stroke}>
      <rect x="7" y="17" width="34" height="22" rx="4" />
      <path d="M18 17v-4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4M7 27h34M21 27v4h6v-4" />
    </svg>
  ),
  projects: (
    <svg viewBox="0 0 48 48" aria-hidden="true" {...stroke}>
      <rect x="8" y="8" width="32" height="32" rx="4" />
      <path d="M8 22h32M22 22v18" />
      <path d="M13 15h10" />
    </svg>
  ),
  vocal: (
    <svg viewBox="0 0 48 48" aria-hidden="true" {...stroke}>
      <rect x="18" y="7" width="12" height="22" rx="6" />
      <path d="M12 23a12 12 0 0 0 24 0M24 35v6M18 41h12" />
    </svg>
  ),
  dream: (
    <svg viewBox="0 0 48 48" aria-hidden="true" {...stroke}>
      <path d="M31 9a15 15 0 1 0 8 25A13 13 0 0 1 31 9Z" />
      <path d="M36 12v4M34 14h4M40 21v2M39 22h2" />
    </svg>
  ),
};

const Arrow = () => (
  <span
    aria-hidden="true"
    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-[1.5px] border-current transition-transform duration-200 group-hover:translate-x-1"
  >
    <svg viewBox="0 0 20 20" className="h-4 w-4" {...stroke}>
      <path d="M4 10h12M11 5l5 5-5 5" />
    </svg>
  </span>
);

const Hero = ({ t }) => {
  const { home, social } = t;

  const panels = [
    {
      id: 'tools',
      to: '/tools',
      ...home.panels.tools,
      className: 'md:col-span-4 bg-primary-500 text-white',
      descClass: 'text-primary-50',
      numClass: 'text-primary-100',
    },
    {
      id: 'projects',
      to: '/tools#projects',
      ...home.panels.projects,
      className: 'md:col-span-2 bg-white text-ink',
      descClass: 'text-ink-soft',
      numClass: 'text-ink-mute',
    },
    {
      id: 'vocal',
      to: '/vocal-practice',
      ...home.panels.vocal,
      className: 'md:col-span-3 bg-sun text-ink',
      descClass: 'text-ink/80',
      numClass: 'text-ink/60',
    },
    {
      id: 'dream',
      to: '/dream-world',
      ...home.panels.dream,
      className: 'md:col-span-3 bg-[#1c1a3a] text-white home-dream-panel',
      descClass: 'text-white/75',
      numClass: 'text-white/55',
    },
  ];

  return (
    <div className="stickman-paper text-ink">
      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-14 pt-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:pb-20 lg:pt-16">
        <div className="order-2 lg:order-1">
          <p className="eyebrow stickman-enter">{home.eyebrow}</p>
          <h1 className="stickman-title stickman-enter-delay mt-5 text-[3.25rem] font-extrabold leading-[1.02] text-ink sm:text-7xl lg:text-[5.5rem]">
            <span className="stickman-scribble">{home.title}</span>
          </h1>
          <p className="stickman-enter-delay-2 text-balance mt-8 max-w-xl text-xl font-bold leading-relaxed text-ink sm:text-2xl">
            {home.subtitle}
          </p>
          <p className="stickman-enter-delay-2 mt-3 text-sm font-semibold tracking-wide text-ink-mute sm:text-base">
            {home.identity}
          </p>
          <div className="stickman-enter-delay-3 mt-8 flex flex-wrap items-center gap-3">
            <Link to="/tools" className="sketch-btn sketch-btn--primary px-6">
              {home.primaryCta}
              <span aria-hidden="true">→</span>
            </Link>
            {social.links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="sketch-btn"
              >
                {link.label}
                <span aria-hidden="true" className="text-ink-mute">↗</span>
              </a>
            ))}
          </div>
        </div>

        <figure className="stickman-enter-delay order-1 mx-auto w-full max-w-md lg:order-2 lg:max-w-none">
          <div className="relative">
            <div className="sketch-card relative overflow-hidden rounded-[22px] bg-paper">
              <img
                src={somaIllustration}
                alt={home.illustrationAlt}
                width="1254"
                height="1254"
                className="block aspect-square w-full scale-[1.12] object-cover"
                fetchpriority="high"
              />
              <span className="absolute right-4 top-4 rounded-full border border-ink/20 bg-white/80 px-2.5 py-0.5 font-display text-xs font-bold text-ink-mute">
                No.01
              </span>
            </div>
            <figcaption className="stickman-float absolute -left-2 top-6 max-w-[13rem] rounded-2xl border-[1.5px] border-ink bg-white px-4 py-2.5 text-sm font-bold leading-snug shadow-sketch sm:-left-6 sm:text-base">
              {home.bubble}
              <span
                aria-hidden="true"
                className="absolute -bottom-[7px] right-8 h-3 w-3 rotate-45 border-b-[1.5px] border-r-[1.5px] border-ink bg-white"
              />
            </figcaption>
          </div>
        </figure>
      </section>

      {/* Now */}
      <section className="border-y-[1.5px] border-ink bg-white">
        <div className="mx-auto grid max-w-6xl gap-0 px-4 sm:px-6 md:grid-cols-[auto_1fr_1fr_1fr]">
          <h2 className="flex items-center py-5 pr-8 font-display text-lg font-extrabold md:border-r-[1.5px] md:border-ink">
            <span className="mr-2 inline-block h-2.5 w-2.5 rounded-full bg-primary-500" aria-hidden="true" />
            {home.nowTitle}
          </h2>
          {home.nowItems.map((item, index) => (
            <div
              key={item.title}
              className={`py-5 md:px-6 ${index > 0 ? 'border-t border-paper-line md:border-l md:border-t-0' : 'border-t border-paper-line md:border-t-0'}`}
            >
              <p className="font-display text-base font-extrabold">{item.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Entries */}
      <section className="mx-auto max-w-6xl px-4 pb-20 pt-16 sm:px-6 lg:pt-20">
        <p className="eyebrow">{home.entriesEyebrow}</p>
        <h2 className="mt-3 font-display text-3xl font-extrabold leading-tight sm:text-4xl">
          {home.entriesTitle}
        </h2>

        <div className="mt-8 grid gap-5 md:grid-cols-6">
          {panels.map((panel, index) => (
            <Link
              key={panel.id}
              to={panel.to}
              className={`sketch-card sketch-link stickman-panel group relative flex min-h-[220px] flex-col justify-between overflow-hidden p-6 sm:p-7 ${panel.className}`}
            >
              <div className="flex items-start justify-between">
                <span className="h-12 w-12">{icons[panel.id]}</span>
                <span className={`font-display text-sm font-bold ${panel.numClass}`}>
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
              <div className="mt-10 flex items-end justify-between gap-4">
                <div>
                  <h3 className="font-display text-2xl font-extrabold sm:text-3xl">{panel.title}</h3>
                  <p className={`mt-1.5 max-w-sm text-sm font-semibold leading-relaxed ${panel.descClass}`}>
                    {panel.description}
                  </p>
                </div>
                <Arrow />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Hero;
