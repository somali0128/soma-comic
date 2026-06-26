import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Hero from './components/Hero/Hero';
import PlaceholderPage from './components/PlaceholderPage/PlaceholderPage';
import SocialFeed from './components/SocialFeed/SocialFeed';
import NotFound from './404';
import zh from './locales/zh';
import en from './locales/en';
import './App.css';

const supportedLanguages = ['zh', 'en'];

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
  const isHome = location.pathname === '/';

  const [currentLanguage, setCurrentLanguage] = useState(getPreferredLanguage);
  const translations = getTranslations(currentLanguage);

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
      {!isHome && (
        <Navbar
          currentLanguage={currentLanguage}
          onLanguageChange={handleLanguageChange}
          t={translations}
        />
      )}

      <main className={`main-content${isHome ? ' main-content--no-nav' : ''}`}>
        <Routes>
            <Route
              path="/"
              element={
                <Hero
                  currentLanguage={currentLanguage}
                  onLanguageChange={handleLanguageChange}
                  t={translations}
                />
              }
            />
            <Route
              path="/order-menu"
              element={
                <PlaceholderPage
                  title={translations.nav.orderMenu}
                  subtitle={translations.placeholder.comingSoon}
                />
              }
            />
            <Route
              path="/social"
              element={<SocialFeed t={translations} />}
            />
            <Route path="*" element={<NotFound />} />
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
