import React from 'react';
import SomaLogo from '../../soma_logo.svg';

const Footer = ({ t }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="gradient-bg text-white py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <img src={SomaLogo} alt="text-gray-300 Logo" className="w-8 h-8" />
              <span className="text-xl font-bold">
                Stick Soma
              </span>
            </div>
          </div>
          
          <div className="flex flex-col gap-4">
            <h4 className="text-lg font-semibold text-gray-200 pl-8">{t.footer.quickLinks}</h4>
            <ul className="flex flex-col gap-2">
              <li><a href="/" className="text-gray-300 font-medium transition-colors duration-200 hover:text-white">{t.nav.home}</a></li>
              <li><a href="/developer" className="text-gray-300 font-medium transition-colors duration-200 hover:text-white">{t.nav.developer}</a></li>
              <li><a href="/creator" className="text-gray-300 font-medium transition-colors duration-200 hover:text-white">{t.nav.creator}</a></li>
              <li><a href="/gallery" className="text-gray-300 font-medium transition-colors duration-200 hover:text-white">{t.nav.gallery}</a></li>
              <li><a href="/contact" className="text-gray-300 font-medium transition-colors duration-200 hover:text-white">{t.nav.contact}</a></li>
            </ul>
          </div>
          
          <div className="flex flex-col gap-4">
            <h4 className="text-lg font-semibold text-gray-200 pl-8">{t.footer.media}</h4>
            <ul className="flex flex-col gap-2">
              <li><a href="https://github.com/somali0128" target="_blank" rel="noopener noreferrer" className="text-gray-300 font-medium transition-colors duration-200 hover:text-white">GitHub</a></li>
              <li><a href="https://space.bilibili.com/290997685" target="_blank" rel="noopener noreferrer" className="text-gray-300 font-medium transition-colors duration-200 hover:text-white">Bilibili</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/20 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-300 text-sm">
            © {currentYear} Stick Soma. {t.footer.copyright}
          </p>
          <p className="text-gray-300 text-sm">
            {t.footer.madeWith}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 