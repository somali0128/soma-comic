import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LanguageSwitch from '../LanguageSwitch/LanguageSwitch';
import SomaLogo from '../../soma_logo.svg';

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 sm:gap-3 transition-colors duration-200 hover:opacity-80" onClick={closeMenu}>
            <img src={SomaLogo} alt="Stick Soma Logo" className="w-8 h-8 sm:w-10 sm:h-10" />
            <span className="text-lg sm:text-2xl font-bold gradient-text">Stick Soma</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-gray-600 font-medium transition-colors duration-200 hover:text-primary-500 relative group">
              {t.nav.home}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <Link to="/developer" className="text-gray-600 font-medium transition-colors duration-200 hover:text-primary-500 relative group">
              {t.nav.developer}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <Link to="/creator" className="text-gray-600 font-medium transition-colors duration-200 hover:text-primary-500 relative group">
              {t.nav.creator}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <Link to="/gallery" className="text-gray-600 font-medium transition-colors duration-200 hover:text-primary-500 relative group">
              {t.nav.gallery}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <Link to="/contact" className="text-gray-600 font-medium transition-colors duration-200 hover:text-primary-500 relative group">
              {t.nav.contact}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <Link to="/messageboard" className="text-gray-600 font-medium transition-colors duration-200 hover:text-primary-500 relative group">
              {t.nav.messageboard}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 transition-all duration-200 group-hover:w-full"></span>
            </Link>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <LanguageSwitch 
              currentLanguage={currentLanguage} 
              onLanguageChange={onLanguageChange} 
            />
            <button 
              className="md:hidden flex flex-col p-2 gap-1.5 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <span className={`w-5 h-0.5 bg-gray-600 rounded transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`w-5 h-0.5 bg-gray-600 rounded transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`w-5 h-0.5 bg-gray-600 rounded transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <div className="py-4 space-y-2 border-t border-gray-200">
            <Link to="/" className="block px-4 py-3 text-gray-600 font-medium transition-colors duration-200 hover:text-primary-500 hover:bg-gray-50 rounded-lg" onClick={closeMenu}>
              {t.nav.home}
            </Link>
            <Link to="/developer" className="block px-4 py-3 text-gray-600 font-medium transition-colors duration-200 hover:text-primary-500 hover:bg-gray-50 rounded-lg" onClick={closeMenu}>
              {t.nav.developer}
            </Link>
            <Link to="/creator" className="block px-4 py-3 text-gray-600 font-medium transition-colors duration-200 hover:text-primary-500 hover:bg-gray-50 rounded-lg" onClick={closeMenu}>
              {t.nav.creator}
            </Link>
            <Link to="/gallery" className="block px-4 py-3 text-gray-600 font-medium transition-colors duration-200 hover:text-primary-500 hover:bg-gray-50 rounded-lg" onClick={closeMenu}>
              {t.nav.gallery}
            </Link>
            <Link to="/contact" className="block px-4 py-3 text-gray-600 font-medium transition-colors duration-200 hover:text-primary-500 hover:bg-gray-50 rounded-lg" onClick={closeMenu}>
              {t.nav.contact}
            </Link>
            <Link to="/messageboard" className="block px-4 py-3 text-gray-600 font-medium transition-colors duration-200 hover:text-primary-500 hover:bg-gray-50 rounded-lg" onClick={closeMenu}>
              {t.nav.messageboard}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 