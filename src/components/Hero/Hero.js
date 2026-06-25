import React from 'react';
import { Link } from 'react-router-dom';
import LanguageSwitch from '../LanguageSwitch/LanguageSwitch';
import SomaLogo from '../../soma_logo.svg';

const PANEL_IMAGES = {
  comics:
    'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?auto=format&fit=crop&w=1600&q=80',
  social:
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80',
  tools:
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&h=900&q=80',
};

const Hero = ({ currentLanguage, onLanguageChange, t }) => {
  const { home } = t;
  const panelList = [
    {
      id: 'comics',
      to: '/comics',
      title: home.panels.comics.title,
      description: home.panels.comics.description,
      image: PANEL_IMAGES.comics,
    },
    {
      id: 'social',
      to: '/social',
      title: home.panels.social.title,
      description: home.panels.social.description,
      image: PANEL_IMAGES.social,
    },
    {
      id: 'tools',
      to: '/order-menu',
      title: home.panels.tools.title,
      description: home.panels.tools.description,
      image: PANEL_IMAGES.tools,
    },
  ];

  return (
    <section className="min-h-screen bg-slate-950 text-white">
      <div className="relative min-h-[88vh] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=2200&q=85"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/78 to-slate-950/25" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_28%,rgba(251,191,36,0.22),transparent_30%)]" />

        <div className="relative z-10 mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-between px-4 py-5 sm:px-6 lg:py-7">
          <header className="flex items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-3">
              <img src={SomaLogo} alt="" className="h-10 w-10" />
              <span className="text-lg font-black sm:text-2xl">Stickman Soma</span>
            </Link>
            <div className="flex items-center gap-4">
              <nav className="hidden items-center gap-6 text-sm font-semibold text-white/80 md:flex">
                <Link className="transition hover:text-white" to="/comics">
                  {t.nav.comicDiary}
                </Link>
                <Link className="transition hover:text-white" to="/social">
                  {t.nav.socialFeed}
                </Link>
                <Link className="transition hover:text-white" to="/order-menu">
                  {t.nav.orderMenu}
                </Link>
              </nav>
              <LanguageSwitch
                currentLanguage={currentLanguage}
                onLanguageChange={onLanguageChange}
                variant="dark"
              />
            </div>
          </header>

          <div className="grid items-end gap-10 pb-10 pt-16 lg:grid-cols-[minmax(0,1fr)_420px] lg:pb-16">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-amber-300">
                {home.eyebrow}
              </p>
              <h1 className="mt-4 max-w-4xl text-4xl font-black leading-[1.05] sm:text-6xl lg:text-7xl">
                {home.title}
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-200 sm:text-lg">
                {home.subtitle}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/social"
                  className="rounded-md bg-amber-300 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-amber-200"
                >
                  {home.primaryCta}
                </Link>
                <a
                  href="https://github.com/somali0128"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md border border-white/35 px-5 py-3 text-sm font-bold text-white transition hover:border-white hover:bg-white/10"
                >
                  GitHub
                </a>
                <a
                  href="https://www.linkedin.com/in/dongyue-li-520bb2374/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md border border-white/35 px-5 py-3 text-sm font-bold text-white transition hover:border-white hover:bg-white/10"
                >
                  LinkedIn
                </a>
                <a
                  href="https://space.bilibili.com/290997685"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md border border-white/35 px-5 py-3 text-sm font-bold text-white transition hover:border-white hover:bg-white/10"
                >
                  Bilibili
                </a>
              </div>
            </div>

            <aside className="rounded-md border border-white/15 bg-slate-950/70 p-5 shadow-2xl backdrop-blur">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-300">
                {home.nowTitle}
              </p>
              <div className="mt-5 space-y-4">
                {home.nowItems.map((item) => (
                  <div key={item.title} className="border-l-2 border-amber-300/70 pl-4">
                    <p className="font-bold text-white">{item.title}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-300">{item.description}</p>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-4 px-4 pb-12 pt-4 sm:px-6 md:grid-cols-3">
        {panelList.map((panel) => (
          <Link
            key={panel.id}
            to={panel.to}
            className="group relative min-h-[230px] overflow-hidden rounded-md border border-white/10 bg-slate-900"
          >
            <img
              src={panel.image}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-72 transition duration-500 group-hover:scale-105 group-hover:opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5">
              <h2 className="text-2xl font-black">{panel.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-200">{panel.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Hero;
