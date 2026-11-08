import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Hero from './components/Hero/Hero';
import OrderMenu from './components/OrderMenu';
import Tools from './components/Tools/Tools';
import LotteryTool from './components/LotteryTool/LotteryTool';
import VocalPractice from './components/VocalPractice/VocalPractice';
import NotFound from './404';
import zh from './locales/zh';
import en from './locales/en';
import './App.css';

const supportedLanguages = ['zh', 'en'];
const DreamWorld = React.lazy(() => import('./components/DreamWorld/DreamWorld'));

const getPreferredLanguage = () => {
  const savedLanguage = localStorage.getItem('language');
  if (supportedLanguages.includes(savedLanguage)) {
    return savedLanguage;
  }

  const browserLanguages = navigator.languages?.length
    ? navigator.languages
    : [navigator.language];
  const hasChinesePreference = browserLanguages.some((language) =>
    language?.toLowerCase().startsWith('zh')
  );

  return hasChinesePreference ? 'zh' : 'en';
};

const getTranslations = (language) => (language === 'zh' ? zh : en);

function AppContent() {
  const location = useLocation();

  const [currentLanguage, setCurrentLanguage] = useState(getPreferredLanguage);
  const translations = getTranslations(currentLanguage);

  useLayoutEffect(() => {
    if (location.hash) {
      const target = document.getElementById(location.hash.slice(1));
      if (target) {
        target.scrollIntoView();
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    document.documentElement.lang = currentLanguage === 'zh' ? 'zh-CN' : 'en';
  }, [currentLanguage]);

  const handleLanguageChange = (language) => {
    if (!supportedLanguages.includes(language)) return;
    setCurrentLanguage(language);
    localStorage.setItem('language', language);
  };

  return (
    <div className="App">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-[60] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-white">
        {currentLanguage === 'zh' ? '跳到正文' : 'Skip to content'}
      </a>
      <Navbar
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
        t={translations}
      />

      <main id="main" className="main-content">
        <Routes>
          <Route
            path="/"
            element={
              <Hero t={translations} />
            }
          />
          <Route path="/tools" element={<Tools t={translations} />} />
          <Route path="/lottery" element={<LotteryTool key={currentLanguage} language={currentLanguage} />} />
          <Route path="/vocal-practice" element={<VocalPractice language={currentLanguage} />} />
          <Route
            path="/dream-world"
            element={
              <React.Suspense
                fallback={
                  <div className="dream-route-loading" role="status">
                    <span aria-hidden="true" />
                    {currentLanguage === 'zh' ? '正在进入梦境…' : 'Entering the dream…'}
                  </div>
                }
              >
                <DreamWorld language={currentLanguage} />
              </React.Suspense>
            }
          />
          <Route path="/order-menu" element={<OrderMenu />} />
          <Route path="/social" element={<Navigate to="/tools" replace />} />
          <Route path="*" element={<NotFound t={translations} />} />
        </Routes>
      </main>

      <Footer t={translations} />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;

