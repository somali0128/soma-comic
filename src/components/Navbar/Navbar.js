import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LanguageSwitch from '../LanguageSwitch/LanguageSwitch';

const Navbar = ({ currentLanguage, onLanguageChange, t }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b-[3px] border-slate-950 bg-primary-50/95 backdrop-blur-md transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 sm:gap-3 transition-colors duration-200 hover:opacity-80" onClick={closeMenu}>
            <span className="font-display text-lg font-black text-primary-700 sm:text-2xl">Stickman Soma</span>
          </Link>

          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <Link to="/" className="relative font-display font-black text-slate-700 transition-colors duration-200 hover:text-primary-700 group">
              {t.nav.home}
              <span className="absolute bottom-0 left-0 w-0 h-[3px] rounded-full bg-primary-500 transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <Link to="/tools" className="relative font-display font-black text-slate-700 transition-colors duration-200 hover:text-primary-700 group">
              {t.nav.tools}
              <span className="absolute bottom-0 left-0 w-0 h-[3px] rounded-full bg-primary-500 transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <Link to="/social" className="relative font-display font-black text-slate-700 transition-colors duration-200 hover:text-primary-700 group">
              {t.nav.socialFeed}
              <span className="absolute bottom-0 left-0 w-0 h-[3px] rounded-full bg-primary-500 transition-all duration-200 group-hover:w-full"></span>
            </Link>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <LanguageSwitch
              currentLanguage={currentLanguage}
              onLanguageChange={onLanguageChange}
            />
            <button
              className="md:hidden flex flex-col p-2 gap-1.5 rounded-md border-2 border-slate-950 bg-white transition-colors duration-200 hover:bg-primary-100"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <span className={`w-5 h-0.5 bg-slate-950 rounded transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`w-5 h-0.5 bg-slate-950 rounded transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`w-5 h-0.5 bg-slate-950 rounded transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </button>
          </div>
        </div>

        <div className={`md:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <div className="py-4 space-y-2 border-t-[3px] border-slate-950">
            <Link to="/" className="block rounded-md border-2 border-transparent px-4 py-3 font-display font-black text-slate-700 transition-colors duration-200 hover:border-slate-950 hover:bg-white hover:text-primary-700" onClick={closeMenu}>
              {t.nav.home}
            </Link>
            <Link to="/tools" className="block rounded-md border-2 border-transparent px-4 py-3 font-display font-black text-slate-700 transition-colors duration-200 hover:border-slate-950 hover:bg-white hover:text-primary-700" onClick={closeMenu}>
              {t.nav.tools}
            </Link>
            <Link to="/social" className="block rounded-md border-2 border-transparent px-4 py-3 font-display font-black text-slate-700 transition-colors duration-200 hover:border-slate-950 hover:bg-white hover:text-primary-700" onClick={closeMenu}>
              {t.nav.socialFeed}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
