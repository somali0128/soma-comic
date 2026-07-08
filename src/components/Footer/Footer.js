import React from 'react';
import SomaLogo from '../../soma_logo.svg';

const Footer = ({ t }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t-[3px] border-slate-950 bg-primary-700 py-8 text-white sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <img src={SomaLogo} alt="" className="w-8 h-8 rounded-full border-2 border-slate-950 bg-primary-50 sm:w-10 sm:h-10" />
              <span className="font-display text-lg font-black sm:text-xl">
                Stickman Soma
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:gap-4">
            <h4 className="font-display text-base font-black text-primary-100 sm:pl-8 sm:text-lg">{t.footer.quickLinks}</h4>
            <ul className="flex flex-col gap-1 sm:gap-2">
              <li><a href="/" className="text-primary-50 font-bold transition-colors duration-200 hover:text-white text-sm sm:text-base">{t.nav.home}</a></li>
              <li><a href="/tools" className="text-primary-50 font-bold transition-colors duration-200 hover:text-white text-sm sm:text-base">{t.nav.tools}</a></li>
              <li><a href="/social" className="text-primary-50 font-bold transition-colors duration-200 hover:text-white text-sm sm:text-base">{t.nav.socialFeed}</a></li>
            </ul>
          </div>

          <div className="flex flex-col gap-3 sm:gap-4 sm:col-span-2 lg:col-span-1">
            <h4 className="font-display text-base font-black text-primary-100 sm:pl-8 sm:text-lg">{t.footer.media}</h4>
            <ul className="flex flex-col gap-1 sm:gap-2">
              <li><a href="https://github.com/somali0128" target="_blank" rel="noopener noreferrer" className="text-primary-50 font-bold transition-colors duration-200 hover:text-white text-sm sm:text-base">GitHub</a></li>
              <li><a href="https://www.linkedin.com/in/dongyue-li-520bb2374/" target="_blank" rel="noopener noreferrer" className="text-primary-50 font-bold transition-colors duration-200 hover:text-white text-sm sm:text-base">LinkedIn</a></li>
              <li><a href="https://space.bilibili.com/290997685" target="_blank" rel="noopener noreferrer" className="text-primary-50 font-bold transition-colors duration-200 hover:text-white text-sm sm:text-base">Bilibili</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 pt-4 sm:pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
          <p className="text-primary-100 text-xs sm:text-sm text-center sm:text-left font-semibold">
            © {currentYear} Stickman Soma. {t.footer.copyright}
          </p>
          <p className="text-primary-100 text-xs sm:text-sm text-center sm:text-right font-semibold">
            {t.footer.madeWith}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
