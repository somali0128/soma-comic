import React from 'react';
import { Link } from 'react-router-dom';

const Hero = ({ t }) => {
  return (
    <section className="min-h-screen flex items-center gradient-bg relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 w-full relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center pt-16">
          <div className="text-white z-10">
            <h1 className="text-5xl lg:text-6xl font-extrabold mb-4 leading-tight bg-gradient-to-r from-white to-gray-100 bg-clip-text text-transparent">
              {t.hero.title}
            </h1>
            <p className="text-xl lg:text-2xl font-semibold mb-6 text-gray-200">
              {t.hero.subtitle}
            </p>
            <p className="text-lg leading-relaxed mb-8 text-gray-300 max-w-lg">
              {t.hero.description}
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link to="/about" className="btn-primary">
                {t.nav.about}
              </Link>
              <Link to="/contact" className="btn-secondary">
                {t.nav.contact}
              </Link>
            </div>
          </div>
          <div className="relative flex justify-center items-center z-10">
            <div className="relative z-30">
              <div className="w-48 h-48 lg:w-56 lg:h-56 rounded-full bg-gradient-to-br from-white to-gray-100 flex items-center justify-center shadow-2xl border-4 border-white">
                <span className="text-4xl lg:text-5xl font-extrabold text-primary-500">SC</span>
              </div>
            </div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="absolute w-72 h-72 lg:w-80 lg:h-80 rounded-full bg-white/10 animate-float"></div>
              <div className="absolute w-48 h-48 lg:w-56 lg:h-56 rounded-full bg-white/10 animate-float" style={{ animationDelay: '2s' }}></div>
              <div className="absolute w-36 h-36 lg:w-40 lg:h-40 rounded-full bg-white/10 animate-float" style={{ animationDelay: '4s' }}></div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero; 