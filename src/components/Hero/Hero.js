import React from 'react';
import { Link } from 'react-router-dom';
import LanguageSwitch from '../LanguageSwitch/LanguageSwitch';

const PANEL_IMAGES = {
  social:
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80',
  tools:
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&h=900&q=80',
};

const Hero = ({ currentLanguage, onLanguageChange, t }) => {
  const { home } = t;
  const panelList = [
    {
      id: 'social',
      to: '/social',
      title: home.panels.social.title,
      description: home.panels.social.description,
      image: PANEL_IMAGES.social,
    },
    {
      id: 'tools',
      to: '/tools',
      title: home.panels.tools.title,
      description: home.panels.tools.description,
      image: PANEL_IMAGES.tools,
    },
  ];

  return (
    <section className="stickman-paper min-h-screen text-slate-950">
      <div className="relative min-h-[88vh] overflow-hidden border-b-[3px] border-slate-950 bg-primary-50">
        <div className="stickman-float pointer-events-none absolute left-[8%] top-28 hidden h-28 w-28 rotate-[-8deg] rounded-full border-[10px] border-primary-400/70 md:block" />
        <div className="stickman-float-slow pointer-events-none absolute bottom-24 right-[9%] hidden h-24 w-36 rotate-[7deg] border-[10px] border-primary-300/80 md:block" />
        <div className="stickman-wiggle pointer-events-none absolute right-[18%] top-24 hidden h-20 w-20 rotate-12 border-l-[10px] border-t-[10px] border-slate-950/20 lg:block" />

        <div className="relative z-10 mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-between px-4 py-5 sm:px-6 lg:py-7">
          <header className="stickman-enter flex items-center justify-between gap-4">
            <Link to="/" className="font-display text-xl font-black text-primary-800 sm:text-3xl">
              Stickman Soma
            </Link>
            <div className="flex items-center gap-4">
              <nav className="hidden items-center gap-6 text-sm font-extrabold text-slate-700 md:flex">
                <Link className="transition hover:text-primary-700" to="/social">
                  {t.nav.socialFeed}
                </Link>
                <Link className="transition hover:text-primary-700" to="/tools">
                  {t.nav.tools}
                </Link>
              </nav>
              <LanguageSwitch
                currentLanguage={currentLanguage}
                onLanguageChange={onLanguageChange}
              />
            </div>
          </header>

          <div className="grid items-end gap-10 pb-10 pt-16 lg:grid-cols-[minmax(0,1fr)_360px] lg:pb-16">
            <div>
              <p className="stickman-enter font-display text-sm font-black uppercase tracking-[0.18em] text-primary-700">
                {home.eyebrow}
              </p>
              <h1 className="stickman-title stickman-enter-delay mt-4 max-w-4xl text-5xl font-black leading-[0.98] text-primary-600 sm:text-7xl lg:text-8xl">
                <span className="stickman-scribble inline-block">{home.title}</span>
              </h1>
              <p className="stickman-enter-delay-2 mt-7 max-w-xl text-xl font-black leading-8 text-slate-800 sm:text-2xl">
                {home.subtitle}
              </p>
              <div className="stickman-enter-delay-3 mt-8 flex flex-wrap gap-3">
                <Link
                  to="/social"
                  className="stickman-card stickman-pop rounded-md bg-primary-500 px-5 py-3 text-sm font-black text-white transition hover:bg-primary-600"
                >
                  {home.primaryCta}
                </Link>
                <a
                  href="https://github.com/somali0128"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="stickman-pop rounded-md border-[3px] border-slate-950 bg-white px-5 py-3 text-sm font-black text-primary-800 transition hover:bg-primary-100"
                >
                  GitHub
                </a>
                <a
                  href="https://www.linkedin.com/in/dongyue-li-520bb2374/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="stickman-pop rounded-md border-[3px] border-slate-950 bg-white px-5 py-3 text-sm font-black text-primary-800 transition hover:bg-primary-100"
                >
                  LinkedIn
                </a>
                <a
                  href="https://space.bilibili.com/290997685"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="stickman-pop rounded-md border-[3px] border-slate-950 bg-white px-5 py-3 text-sm font-black text-primary-800 transition hover:bg-primary-100"
                >
                  Bilibili
                </a>
              </div>
            </div>

            <aside className="stickman-card-blue stickman-enter-delay-2 rounded-md bg-white p-5">
              <p className="font-display text-sm font-black uppercase tracking-[0.16em] text-primary-700">
                {home.nowTitle}
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                {home.nowItems.map((item) => (
                  <span
                    key={item.title}
                    className="stickman-pop rounded-md border-[3px] border-slate-950 bg-primary-50 px-3 py-2 font-display text-sm font-black text-primary-800"
                  >
                    {item.title}
                  </span>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-4 px-4 pb-12 pt-6 sm:px-6 md:grid-cols-2">
        {panelList.map((panel) => (
          <Link
            key={panel.id}
            to={panel.to}
            className="stickman-card-blue stickman-panel group relative min-h-[210px] overflow-hidden rounded-md bg-primary-900"
          >
            <img
              src={panel.image}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-58 grayscale transition duration-500 group-hover:scale-105 group-hover:opacity-80 group-hover:grayscale-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary-900 via-primary-900/55 to-primary-600/10" />
            <div className="absolute inset-x-0 bottom-0 p-5">
              <h2 className="font-display text-3xl font-black text-white">{panel.title}</h2>
              <p className="mt-2 max-w-md text-sm font-bold text-primary-50">{panel.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Hero;
