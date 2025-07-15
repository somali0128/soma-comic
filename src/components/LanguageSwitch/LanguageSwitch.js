import React from 'react';

const LanguageSwitch = ({ currentLanguage, onLanguageChange }) => {
  return (
    <div className="flex items-center gap-2">
      <button
        className={`px-3 py-1.5 border rounded-md text-sm font-medium transition-all duration-200 ${
          currentLanguage === 'zh' 
            ? 'bg-primary-500 border-primary-500 text-white hover:bg-primary-600' 
            : 'border-gray-300 bg-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-400 hover:text-gray-700'
        }`}
        onClick={() => onLanguageChange('zh')}
      >
        中文
      </button>
      <button
        className={`px-3 py-1.5 border rounded-md text-sm font-medium transition-all duration-200 ${
          currentLanguage === 'en' 
            ? 'bg-primary-500 border-primary-500 text-white hover:bg-primary-600' 
            : 'border-gray-300 bg-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-400 hover:text-gray-700'
        }`}
        onClick={() => onLanguageChange('en')}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageSwitch; 