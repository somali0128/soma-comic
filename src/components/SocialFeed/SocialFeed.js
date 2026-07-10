import React, { useEffect, useMemo, useState } from 'react';

const platformStyles = {
  github: {
    label: 'GitHub',
    badge: 'bg-primary-700 text-white',
    dot: 'bg-primary-700',
  },
  linkedin: {
    label: 'LinkedIn',
    badge: 'bg-primary-600 text-white',
    dot: 'bg-primary-600',
  },
  bilibili: {
    label: 'Bilibili',
    badge: 'bg-secondary-500 text-white',
    dot: 'bg-secondary-500',
  },
  site: {
    label: 'Site',
    badge: 'bg-primary-300 text-slate-950',
    dot: 'bg-primary-300',
  },
};

const SocialFeed = ({ t }) => {
  const [activePlatform, setActivePlatform] = useState('all');
  const [syncedItems, setSyncedItems] = useState(null);
  const { social } = t;
  const locale = social.locale || 'en';

  useEffect(() => {
    let isMounted = true;
    const publicUrl = process.env.PUBLIC_URL || '';

    fetch(`${publicUrl}/social-feed.json`, { cache: 'no-store' })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Unable to load social feed: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (!isMounted || !Array.isArray(data.items) || data.items.length === 0) {
          return;
        }

        setSyncedItems(data.items);
      })
      .catch(() => {
        if (isMounted) {
          setSyncedItems(null);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const feedItems = useMemo(() => {
    if (!syncedItems) return social.items;

    const staticItems = social.items.filter(
      (item) => !['github', 'bilibili'].includes(item.platform)
    );

    return [...syncedItems, ...staticItems];
  }, [social.items, syncedItems]);

  const visibleItems = useMemo(() => {
    if (activePlatform === 'all') return feedItems;
    return feedItems.filter((item) => item.platform === activePlatform);
  }, [activePlatform, feedItems]);

  return (
    <section className="stickman-paper min-h-screen pb-16">
      <div className="border-b-[3px] border-slate-950 bg-primary-50">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:py-14">
          <div className="flex flex-col justify-center">
            <p className="font-display text-sm font-black uppercase tracking-[0.16em] text-primary-700">
              {social.eyebrow}
            </p>
            <h1 className="stickman-title mt-3 text-3xl font-black leading-tight text-primary-600 sm:text-4xl lg:text-5xl">
              <span className="stickman-scribble inline-block">{social.title}</span>
            </h1>
            <p className="mt-7 max-w-2xl text-base font-semibold leading-8 text-slate-700 sm:text-lg">
              {social.subtitle}
            </p>
          </div>

          <aside className="stickman-card-blue rounded-md bg-white p-5 text-slate-950">
            <div className="flex items-center gap-4">
              <img
                src="https://avatars.githubusercontent.com/u/66934242?v=4"
                alt="Soma Li"
                className="h-16 w-16 rounded-full border-[3px] border-slate-950 bg-primary-50"
              />
              <div>
                <p className="font-display text-lg font-black text-primary-800">Soma Li</p>
                <p className="text-sm font-semibold text-slate-600">{social.profileRole}</p>
              </div>
            </div>
            <dl className="mt-6 grid grid-cols-3 gap-3">
              {social.stats.map((stat) => (
                <div key={stat.label} className="rounded-md border-2 border-primary-200 bg-primary-50 p-3">
                  <dt className="text-xs font-bold text-primary-700">{stat.label}</dt>
                  <dd className="mt-1 font-display text-lg font-black">{stat.value}</dd>
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
                    ? 'border-[3px] border-slate-950 bg-primary-600 text-white shadow-[4px_4px_0_rgba(7,27,52,0.18)]'
                    : 'border-[3px] border-slate-950 bg-white text-primary-800 hover:bg-primary-100'
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
                className="rounded-md border-[3px] border-slate-950 bg-white px-4 py-2 text-sm font-black text-primary-800 transition hover:-translate-y-0.5 hover:bg-primary-100"
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
              const dateLabel =
                typeof item.date === 'object'
                  ? item.date[locale] || item.date.en || item.date.zh
                  : item.date;
              return (
                <article
                  key={item.id}
                  className="stickman-card-blue rounded-md bg-white p-5 transition hover:-translate-y-0.5"
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`rounded border-2 border-slate-950 px-2.5 py-1 text-xs font-black ${style.badge}`}>
                      {style.label}
                    </span>
                    <span className="text-sm font-bold text-slate-500">{dateLabel}</span>
                    <span className="text-sm font-bold text-primary-400">/</span>
                    <span className="text-sm font-bold text-slate-500">{item.type}</span>
                  </div>
                  <h2 className="mt-4 font-display text-xl font-black leading-snug text-slate-950">
                    {item.title}
                  </h2>
                  <p className="mt-3 text-base font-semibold leading-7 text-slate-600">{item.summary}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {(item.tags || []).map((tag) => (
                      <span
                        key={tag}
                        className="rounded border-2 border-primary-200 bg-primary-50 px-2.5 py-1 text-xs font-bold text-primary-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="stickman-card mt-5 inline-flex rounded-md bg-primary-500 px-4 py-2 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-primary-600"
                  >
                    {social.openLink}
                  </a>
                </article>
              );
            })}
          </div>

          <aside className="space-y-4">
            <section className="stickman-card-blue rounded-md bg-white p-5">
              <h2 className="font-display text-lg font-black text-primary-800">{social.rhythmTitle}</h2>
              <div className="mt-5 space-y-4">
                {social.rhythm.map((item) => {
                  const style = platformStyles[item.platform];
                  return (
                    <div key={item.title} className="flex gap-3">
                      <span className={`mt-2 h-2.5 w-2.5 shrink-0 rounded-full ${style.dot}`} />
                      <div>
                        <p className="font-display font-black text-slate-900">{item.title}</p>
                        <p className="text-sm font-semibold leading-6 text-slate-500">{item.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="stickman-card-blue rounded-md bg-white p-5">
              <h2 className="font-display text-lg font-black text-primary-800">{social.contactTitle}</h2>
              <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">{social.contactBody}</p>
              <a
                href="https://www.linkedin.com/in/dongyue-li-520bb2374/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex rounded-md border-[3px] border-slate-950 px-4 py-2 text-sm font-black text-primary-700 transition hover:-translate-y-0.5 hover:bg-primary-600 hover:text-white"
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
