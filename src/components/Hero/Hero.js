import React from 'react';
import { Link } from 'react-router-dom';
import SomaLogo from '../../soma_logo.svg';

const Hero = ({ t }) => {
  return (
    <section className="min-h-screen flex items-center gradient-bg relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center pt-16">
          <div className="text-white z-10 text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight bg-gradient-to-r from-white to-gray-100 bg-clip-text text-transparent">
              {t.hero.title}
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl font-semibold mb-4 lg:mb-6 text-gray-200">
              {t.hero.subtitle}
            </p>
            <p className="text-base sm:text-lg leading-relaxed mb-6 lg:mb-8 text-gray-300 max-w-lg mx-auto lg:mx-0">
              {t.hero.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/developer" className="btn-primary text-center">
                {t.nav.developer}
              </Link>
              <Link to="/contact" className="btn-secondary text-center">
                {t.nav.contact}
              </Link>
            </div>
          </div>
          <div className="relative flex justify-center items-center z-10 mt-8 lg:mt-0">
            <div className="relative z-30">
              <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 rounded-full bg-gradient-to-br from-white to-gray-100 flex items-center justify-center shadow-2xl border-4 border-white p-4 sm:p-6 md:p-8">
                <img src={SomaLogo} alt="Stick Soma Logo" className="w-full h-full" />
              </div>
            </div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="absolute w-48 h-48 sm:w-56 sm:h-56 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-full bg-white/10 animate-float"></div>
              <div className="absolute w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 rounded-full bg-white/10 animate-float" style={{ animationDelay: '2s' }}></div>
              <div className="absolute w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-full bg-white/10 animate-float" style={{ animationDelay: '4s' }}></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 