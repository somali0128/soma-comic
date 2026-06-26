import React from 'react';

const LanguageSwitch = ({ currentLanguage, onLanguageChange, variant = 'light' }) => {
  const isDark = variant === 'dark';
  const inactiveClass = isDark
    ? 'border-white/30 bg-white/10 text-white hover:bg-white/20 hover:border-white/60'
    : 'border-gray-300 bg-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-400 hover:text-gray-700';
  const activeClass = isDark
    ? 'bg-primary-300 border-primary-300 text-slate-950 hover:bg-primary-200'
    : 'bg-primary-500 border-primary-500 text-white hover:bg-primary-600';

  return (
    <div className="flex items-center gap-1 sm:gap-2" aria-label="Language switcher">
      <button
        className={`px-2 sm:px-3 py-1.5 border rounded-md text-xs sm:text-sm font-medium transition-all duration-200 touch-target ${
          currentLanguage === 'zh' ? activeClass : inactiveClass
        }`}
        onClick={() => onLanguageChange('zh')}
        aria-pressed={currentLanguage === 'zh'}
        aria-label="Switch to Chinese"
      >
        中文
      </button>
      <button
        className={`px-2 sm:px-3 py-1.5 border rounded-md text-xs sm:text-sm font-medium transition-all duration-200 touch-target ${
          currentLanguage === 'en' ? activeClass : inactiveClass
        }`}
        onClick={() => onLanguageChange('en')}
        aria-pressed={currentLanguage === 'en'}
        aria-label="Switch to English"
      >
        EN
      </button>
    </div>
  );
};

export default LanguageSwitch; 
