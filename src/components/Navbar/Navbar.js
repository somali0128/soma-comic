import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LanguageSwitch from '../LanguageSwitch/LanguageSwitch';
import './Navbar.css';

const Navbar = ({ currentLanguage, onLanguageChange, t }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <span className="brand-text">Soma Comic</span>
        </Link>

        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-link" onClick={closeMenu}>
            {t.nav.home}
          </Link>
          <Link to="/about" className="nav-link" onClick={closeMenu}>
            {t.nav.about}
          </Link>
          <Link to="/skills" className="nav-link" onClick={closeMenu}>
            {t.nav.skills}
          </Link>
          <Link to="/interests" className="nav-link" onClick={closeMenu}>
            {t.nav.interests}
          </Link>
          <Link to="/contact" className="nav-link" onClick={closeMenu}>
            {t.nav.contact}
          </Link>
        </div>

        <div className="navbar-right">
          <LanguageSwitch 
            currentLanguage={currentLanguage} 
            onLanguageChange={onLanguageChange} 
          />
          <button 
            className={`hamburger ${isMenuOpen ? 'active' : ''}`} 
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 