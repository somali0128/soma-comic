import React from 'react';

const LanguageSwitch = ({ currentLanguage, onLanguageChange }) => {
  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <button
        className={`px-2 sm:px-3 py-1.5 border rounded-md text-xs sm:text-sm font-medium transition-all duration-200 touch-target ${
          currentLanguage === 'zh' 
            ? 'bg-primary-500 border-primary-500 text-white hover:bg-primary-600' 
            : 'border-gray-300 bg-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-400 hover:text-gray-700'
        }`}
        onClick={() => onLanguageChange('zh')}
        aria-label="Switch to Chinese"
      >
        中文
      </button>
      <button
        className={`px-2 sm:px-3 py-1.5 border rounded-md text-xs sm:text-sm font-medium transition-all duration-200 touch-target ${
          currentLanguage === 'en' 
            ? 'bg-primary-500 border-primary-500 text-white hover:bg-primary-600' 
            : 'border-gray-300 bg-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-400 hover:text-gray-700'
        }`}
        onClick={() => onLanguageChange('en')}
        aria-label="Switch to English"
      >
        EN
      </button>
    </div>
  );
};

export default LanguageSwitch; 