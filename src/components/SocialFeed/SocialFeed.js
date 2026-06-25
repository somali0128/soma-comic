import React, { useMemo, useState } from 'react';

const platformStyles = {
  github: {
    label: 'GitHub',
    badge: 'bg-slate-950 text-white',
    dot: 'bg-slate-950',
  },
  linkedin: {
    label: 'LinkedIn',
    badge: 'bg-sky-700 text-white',
    dot: 'bg-sky-600',
  },
  bilibili: {
    label: 'Bilibili',
    badge: 'bg-pink-500 text-white',
    dot: 'bg-pink-500',
  },
  site: {
    label: 'Site',
    badge: 'bg-amber-500 text-slate-950',
    dot: 'bg-amber-500',
  },
};

const SocialFeed = ({ t }) => {
  const [activePlatform, setActivePlatform] = useState('all');
  const { social } = t;

  const visibleItems = useMemo(() => {
    if (activePlatform === 'all') return social.items;
    return social.items.filter((item) => item.platform === activePlatform);
  }, [activePlatform, social.items]);

  return (
    <section className="min-h-screen bg-[#f7f8fb] pb-16">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:py-14">
          <div className="flex flex-col justify-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-600">
              {social.eyebrow}
            </p>
            <h1 className="mt-3 text-3xl font-black leading-tight text-slate-950 sm:text-4xl lg:text-5xl">
              {social.title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              {social.subtitle}
            </p>
          </div>

          <aside className="rounded-md border border-slate-200 bg-slate-950 p-5 text-white shadow-sm">
            <div className="flex items-center gap-4">
              <img
                src="https://avatars.githubusercontent.com/u/66934242?v=4"
                alt="Soma Li"
                className="h-16 w-16 rounded-full border-2 border-white/20"
              />
              <div>
                <p className="text-lg font-bold">Soma Li</p>
                <p className="text-sm text-slate-300">{social.profileRole}</p>
              </div>
            </div>
            <dl className="mt-6 grid grid-cols-3 gap-3">
              {social.stats.map((stat) => (
                <div key={stat.label} className="rounded-md bg-white/[0.08] p-3">
                  <dt className="text-xs text-slate-400">{stat.label}</dt>
                  <dd className="mt-1 text-lg font-bold">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2" role="tablist" aria-label={social.filterLabel}>
            {social.filters.map((filter) => (
              <button
                key={filter.id}
                type="button"
                role="tab"
                aria-selected={activePlatform === filter.id}
                onClick={() => setActivePlatform(filter.id)}
                className={`rounded-md border px-4 py-2 text-sm font-semibold transition ${
                  activePlatform === filter.id
                    ? 'border-slate-950 bg-slate-950 text-white'
                    : 'border-slate-300 bg-white text-slate-700 hover:border-slate-500'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {social.links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-primary-500 hover:text-primary-600"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-4">
            {visibleItems.map((item) => {
              const style = platformStyles[item.platform];
              return (
                <article
                  key={item.id}
                  className="rounded-md border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-md"
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`rounded px-2.5 py-1 text-xs font-bold ${style.badge}`}>
                      {style.label}
                    </span>
                    <span className="text-sm text-slate-500">{item.date}</span>
                    <span className="text-sm text-slate-400">/</span>
                    <span className="text-sm font-medium text-slate-500">{item.type}</span>
                  </div>
                  <h2 className="mt-4 text-xl font-bold leading-snug text-slate-950">
                    {item.title}
                  </h2>
                  <p className="mt-3 text-base leading-7 text-slate-600">{item.summary}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex rounded-md bg-primary-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-primary-700"
                  >
                    {social.openLink}
                  </a>
                </article>
              );
            })}
          </div>

          <aside className="space-y-4">
            <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-slate-950">{social.rhythmTitle}</h2>
              <div className="mt-5 space-y-4">
                {social.rhythm.map((item) => {
                  const style = platformStyles[item.platform];
                  return (
                    <div key={item.title} className="flex gap-3">
                      <span className={`mt-2 h-2.5 w-2.5 shrink-0 rounded-full ${style.dot}`} />
                      <div>
                        <p className="font-semibold text-slate-900">{item.title}</p>
                        <p className="text-sm leading-6 text-slate-500">{item.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-slate-950">{social.contactTitle}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{social.contactBody}</p>
              <a
                href="https://www.linkedin.com/in/dongyue-li-520bb2374/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex rounded-md border border-sky-700 px-4 py-2 text-sm font-bold text-sky-700 transition hover:bg-sky-700 hover:text-white"
              >
                LinkedIn
              </a>
            </section>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default SocialFeed;
