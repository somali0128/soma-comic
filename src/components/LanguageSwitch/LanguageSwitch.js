import React from 'react';
import './LanguageSwitch.css';

const LanguageSwitch = ({ currentLanguage, onLanguageChange }) => {
  return (
    <div className="language-switch">
      <button
        className={`lang-btn ${currentLanguage === 'zh' ? 'active' : ''}`}
        onClick={() => onLanguageChange('zh')}
      >
        中文
      </button>
      <button
        className={`lang-btn ${currentLanguage === 'en' ? 'active' : ''}`}
        onClick={() => onLanguageChange('en')}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageSwitch; 