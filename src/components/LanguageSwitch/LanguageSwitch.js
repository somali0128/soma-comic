import React from 'react';

const OPTIONS = [
  { id: 'zh', label: '中', ariaLabel: 'Switch to Chinese' },
  { id: 'en', label: 'EN', ariaLabel: 'Switch to English' },
];

const LanguageSwitch = ({ currentLanguage, onLanguageChange, variant = 'light' }) => {
  const isDark = variant === 'dark';

  return (
    <div
      role="group"
      aria-label="Language switcher"
      className={`inline-flex items-center rounded-full border-[1.5px] p-0.5 ${
        isDark ? 'border-white/40 bg-white/10' : 'border-ink bg-white'
      }`}
    >
      {OPTIONS.map((option) => {
        const isActive = currentLanguage === option.id;
        const activeClass = isDark ? 'bg-white text-ink' : 'bg-ink text-white';
        const idleClass = isDark
          ? 'text-white/80 hover:text-white'
          : 'text-ink-soft hover:text-ink';
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onLanguageChange(option.id)}
            aria-pressed={isActive}
            aria-label={option.ariaLabel}
            className={`!min-h-[32px] !min-w-[40px] rounded-full px-2.5 text-xs font-extrabold transition-colors duration-150 ${
              isActive ? activeClass : idleClass
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};

export default LanguageSwitch;
