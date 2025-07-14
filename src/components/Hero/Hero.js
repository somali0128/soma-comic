import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

const Hero = ({ t }) => {
  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              {t.hero.title}
            </h1>
            <p className="hero-subtitle">
              {t.hero.subtitle}
            </p>
            <p className="hero-description">
              {t.hero.description}
            </p>
            <div className="hero-buttons">
              <Link to="/about" className="hero-btn primary">
                {t.nav.about}
              </Link>
              <Link to="/contact" className="hero-btn secondary">
                {t.nav.contact}
              </Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-avatar">
              <div className="avatar-placeholder">
                <span className="avatar-text">SC</span>
              </div>
            </div>
            <div className="hero-decoration">
              <div className="decoration-circle circle-1"></div>
              <div className="decoration-circle circle-2"></div>
              <div className="decoration-circle circle-3"></div>
            </div>
          </div>
        </div>
        
        <div className="hero-scroll-indicator">
          <div className="scroll-arrow"></div>
          <span className="scroll-text">向下滚动</span>
        </div>
      </div>
    </section>
  );
};

export default Hero; 