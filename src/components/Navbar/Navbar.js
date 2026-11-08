import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import LanguageSwitch from '../LanguageSwitch/LanguageSwitch';
import SomaLogo from '../../soma_logo.svg';

const Navbar = ({ currentLanguage, onLanguageChange, t }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname, hash } = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname, hash]);

  useEffect(() => {
    if (!isMenuOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setIsMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isMenuOpen]);

  const links = [
    { to: '/', label: t.nav.home, isActive: pathname === '/' },
    { to: '/tools', label: t.nav.tools, isActive: pathname === '/tools' && hash !== '#projects' },
    { to: '/tools#projects', label: t.nav.projects, isActive: pathname === '/tools' && hash === '#projects' },
    { to: '/vocal-practice', label: t.nav.vocal, isActive: pathname === '/vocal-practice' },
    { to: '/dream-world', label: t.nav.dreamArchive, isActive: pathname === '/dream-world' },
  ];

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b-[1.5px] border-ink bg-paper/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="group flex shrink-0 items-center gap-2.5" aria-label={t.brandName}>
          <img
            src={SomaLogo}
            alt=""
            className="h-9 w-9 transition-transform duration-200 group-hover:-rotate-6"
          />
          <span className="font-display text-lg font-extrabold leading-none tracking-tight text-ink sm:text-xl">
            {t.brandName}
          </span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                aria-current={link.isActive ? 'page' : undefined}
                className={`block whitespace-nowrap rounded-full px-3 py-1.5 text-[0.9375rem] font-bold transition-colors duration-150 lg:px-3.5 ${
                  link.isActive
                    ? 'bg-ink text-white'
                    : 'text-ink-soft hover:bg-paper-deep hover:text-ink'
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <LanguageSwitch currentLanguage={currentLanguage} onLanguageChange={onLanguageChange} />
          <button
            type="button"
            className="flex !min-h-[38px] !min-w-[38px] flex-col items-center justify-center gap-[5px] rounded-full border-[1.5px] border-ink bg-white md:hidden"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-label={isMenuOpen ? t.nav.close : t.nav.menu}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav"
          >
            <span className={`h-[1.5px] w-4 rounded bg-ink transition-transform duration-200 ${isMenuOpen ? 'translate-y-[6.5px] rotate-45' : ''}`} />
            <span className={`h-[1.5px] w-4 rounded bg-ink transition-opacity duration-200 ${isMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`h-[1.5px] w-4 rounded bg-ink transition-transform duration-200 ${isMenuOpen ? '-translate-y-[6.5px] -rotate-45' : ''}`} />
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        hidden={!isMenuOpen}
        className="border-t-[1.5px] border-ink bg-paper md:hidden"
      >
        <ul className="mx-auto grid max-w-6xl gap-1 px-4 py-3">
          {links.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                aria-current={link.isActive ? 'page' : undefined}
                className={`flex items-center justify-between rounded-xl px-4 py-3 font-display text-lg font-bold ${
                  link.isActive ? 'bg-ink text-white' : 'text-ink hover:bg-paper-deep'
                }`}
              >
                {link.label}
                <span aria-hidden="true">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
