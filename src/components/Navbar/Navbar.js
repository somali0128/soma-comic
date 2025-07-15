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
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-gray-200 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold gradient-text transition-colors duration-200 hover:text-primary-600" onClick={closeMenu}>
            Soma Comic
          </Link>

          <div className={`md:flex items-center gap-8 ${isMenuOpen ? 'fixed top-16 left-0 right-0 bg-white/98 backdrop-blur-md flex-col py-8 gap-6 border-b border-gray-200 transform translate-y-0 opacity-100 visible' : 'hidden md:flex'}`}>
            <Link to="/" className="text-gray-600 font-medium transition-colors duration-200 hover:text-primary-500 relative group" onClick={closeMenu}>
              {t.nav.home}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <Link to="/about" className="text-gray-600 font-medium transition-colors duration-200 hover:text-primary-500 relative group" onClick={closeMenu}>
              {t.nav.about}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <Link to="/skills" className="text-gray-600 font-medium transition-colors duration-200 hover:text-primary-500 relative group" onClick={closeMenu}>
              {t.nav.skills}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <Link to="/interests" className="text-gray-600 font-medium transition-colors duration-200 hover:text-primary-500 relative group" onClick={closeMenu}>
              {t.nav.interests}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <Link to="/contact" className="text-gray-600 font-medium transition-colors duration-200 hover:text-primary-500 relative group" onClick={closeMenu}>
              {t.nav.contact}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 transition-all duration-200 group-hover:w-full"></span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <LanguageSwitch 
              currentLanguage={currentLanguage} 
              onLanguageChange={onLanguageChange} 
            />
            <button 
              className={`md:hidden flex flex-col p-1 gap-1 ${isMenuOpen ? 'active' : ''}`}
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <span className={`w-6 h-0.5 bg-gray-600 rounded transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
              <span className={`w-6 h-0.5 bg-gray-600 rounded transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`w-6 h-0.5 bg-gray-600 rounded transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 