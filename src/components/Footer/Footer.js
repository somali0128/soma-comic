import React from 'react';
import { Link } from 'react-router-dom';
import SomaLogo from '../../soma_logo.svg';

const linkClass =
  'inline-flex items-center gap-1 text-sm font-semibold text-ink-soft transition-colors duration-150 hover:text-primary-600';

const Footer = ({ t }) => {
  const currentYear = new Date().getFullYear();

  const siteLinks = [
    { to: '/', label: t.nav.home },
    { to: '/tools', label: t.nav.tools },
    { to: '/tools#projects', label: t.nav.projects },
    { to: '/vocal-practice', label: t.nav.vocal },
    { to: '/dream-world', label: t.nav.dreamArchive },
  ];

  return (
    <footer className="mt-auto border-t-[1.5px] border-ink bg-paper-deep text-ink">
      <div className="mx-auto max-w-6xl px-4 pb-8 pt-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Link to="/" className="inline-flex items-center gap-2.5">
              <img src={SomaLogo} alt="" className="h-10 w-10" />
              <span className="font-display text-xl font-extrabold">{t.brandName}</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-soft">{t.footer.tagline}</p>
          </div>

          <nav aria-label={t.footer.quickLinks}>
            <h2 className="text-xs font-extrabold uppercase tracking-[0.14em] text-ink-mute">
              {t.footer.quickLinks}
            </h2>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5 sm:grid-cols-1">
              {siteLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-xs font-extrabold uppercase tracking-[0.14em] text-ink-mute">
              {t.footer.media}
            </h2>
            <ul className="mt-4 grid gap-2.5">
              {t.social.links.map((link) => (
                <li key={link.label}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    {link.label}
                    <span aria-hidden="true" className="text-xs">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-paper-line pt-6 text-xs font-semibold text-ink-mute sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {currentYear} {t.brandName}. {t.footer.copyright}
          </p>
          <p>{t.footer.madeWith}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
