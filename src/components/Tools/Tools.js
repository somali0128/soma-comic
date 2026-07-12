import React from 'react';
import { Link } from 'react-router-dom';

const Tools = ({ t }) => {
  const { eyebrow, title, subtitle, statusLabel, items } = t.toolsPage;

  const tools = [
    {
      id: 'clock',
      title: items.clock.title,
      description: items.clock.description,
      details: items.clock.details,
      status: items.clock.status,
      linkLabel: items.clock.linkLabel,
      icon: '⏰',
      href: 'https://github.com/somali0128/clock-widget-qiu',
    },
    {
      id: 'orderMenu',
      title: items.orderMenu.title,
      description: items.orderMenu.description,
      details: items.orderMenu.details,
      status: items.orderMenu.status,
      linkLabel: items.orderMenu.linkLabel,
      icon: '🍜',
      href: 'https://github.com/somali0128/wechat-order-menu',
    },
  ];

  return (
    <section className="stickman-paper min-h-[70vh] px-4 pb-16 pt-24 text-slate-950 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8">
          <p className="font-display text-sm font-black uppercase tracking-[0.18em] text-primary-700">
            {eyebrow}
          </p>
          <h1 className="mt-3 font-display text-4xl font-black text-primary-700 sm:text-5xl">
            {title}
          </h1>
          <p className="mt-3 max-w-2xl text-base font-bold leading-7 text-slate-700">
            {subtitle}
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-2">
          {tools.map((tool) => {
            const CardContent = (
              <article className="stickman-card-blue h-full rounded-md bg-white p-6 transition hover:-translate-y-0.5">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-12 w-12 items-center justify-center rounded-md border-[3px] border-slate-950 bg-primary-50 text-2xl"
                      aria-hidden
                    >
                      {tool.icon}
                    </span>
                    <div>
                      <h2 className="font-display text-xl font-black text-slate-950">
                        {tool.title}
                      </h2>
                      <p className="mt-1 text-sm font-bold text-primary-700">
                        {tool.status}
                      </p>
                    </div>
                  </div>
                  <span className="rounded-md border-2 border-slate-950 bg-primary-100 px-3 py-1 text-xs font-black text-primary-800">
                    {statusLabel}
                  </span>
                </div>

                <p className="text-sm font-semibold leading-6 text-slate-700">
                  {tool.description}
                </p>
                <ul className="mt-5 space-y-2">
                  {tool.details.map((detail) => (
                    <li
                      key={detail}
                      className="flex gap-2 text-sm font-semibold leading-6 text-slate-700"
                    >
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary-500" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 font-display text-sm font-black text-primary-700">
                  {tool.linkLabel}
                </p>
              </article>
            );

            return tool.href ? (
              <a
                key={tool.id}
                href={tool.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                {CardContent}
              </a>
            ) : tool.to ? (
              <Link key={tool.id} to={tool.to} className="block">
                {CardContent}
              </Link>
            ) : (
              <div key={tool.id}>{CardContent}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Tools;
