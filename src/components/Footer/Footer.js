import React from 'react';
import SomaLogo from '../../soma_logo.svg';

const Footer = ({ t }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="gradient-bg text-white py-8 sm:py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <img src={SomaLogo} alt="text-gray-300 Logo" className="w-6 h-6 sm:w-8 sm:h-8" />
              <span className="text-lg sm:text-xl font-bold">
                Stick Soma
              </span>
            </div>
          </div>
          
          <div className="flex flex-col gap-3 sm:gap-4">
            <h4 className="text-base sm:text-lg font-semibold text-gray-200 pl-0 sm:pl-8">{t.footer.quickLinks}</h4>
            <ul className="flex flex-col gap-1 sm:gap-2">
              <li><a href="/" className="text-gray-300 font-medium transition-colors duration-200 hover:text-white text-sm sm:text-base">{t.nav.home}</a></li>
              <li><a href="/developer" className="text-gray-300 font-medium transition-colors duration-200 hover:text-white text-sm sm:text-base">{t.nav.developer}</a></li>
              <li><a href="/creator" className="text-gray-300 font-medium transition-colors duration-200 hover:text-white text-sm sm:text-base">{t.nav.creator}</a></li>
              <li><a href="/gallery" className="text-gray-300 font-medium transition-colors duration-200 hover:text-white text-sm sm:text-base">{t.nav.gallery}</a></li>
              <li><a href="/contact" className="text-gray-300 font-medium transition-colors duration-200 hover:text-white text-sm sm:text-base">{t.nav.contact}</a></li>
            </ul>
          </div>
          
          <div className="flex flex-col gap-3 sm:gap-4 sm:col-span-2 lg:col-span-1">
            <h4 className="text-base sm:text-lg font-semibold text-gray-200 pl-0 sm:pl-8">{t.footer.media}</h4>
            <ul className="flex flex-col gap-1 sm:gap-2">
              <li><a href="https://github.com/somali0128" target="_blank" rel="noopener noreferrer" className="text-gray-300 font-medium transition-colors duration-200 hover:text-white text-sm sm:text-base">GitHub</a></li>
              <li><a href="https://space.bilibili.com/290997685" target="_blank" rel="noopener noreferrer" className="text-gray-300 font-medium transition-colors duration-200 hover:text-white text-sm sm:text-base">Bilibili</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/20 pt-4 sm:pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
          <p className="text-gray-300 text-xs sm:text-sm text-center sm:text-left">
            © {currentYear} Stick Soma. {t.footer.copyright}
          </p>
          <p className="text-gray-300 text-xs sm:text-sm text-center sm:text-right">
            {t.footer.madeWith}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 