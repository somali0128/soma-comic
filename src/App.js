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
import NotFound from './404';
import zh from './locales/zh';
import en from './locales/en';
import './App.css';

function AppContent() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  const [currentLanguage, setCurrentLanguage] = useState('zh');
  const [translations, setTranslations] = useState(zh);

  useEffect(() => {
    // 从localStorage获取保存的语言设置
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
      setTranslations(savedLanguage === 'zh' ? zh : en);
    }
  }, []);

  const handleLanguageChange = (language) => {
    setCurrentLanguage(language);
    setTranslations(language === 'zh' ? zh : en);
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
            <Route path="/" element={<Hero t={translations} />} />
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
              path="/comics"
              element={
                <PlaceholderPage
                  title={translations.nav.comicDiary}
                  subtitle={translations.placeholder.comingSoon}
                />
              }
            />
            <Route
              path="/social"
              element={
                <PlaceholderPage
                  title={translations.nav.socialFeed}
                  subtitle={translations.placeholder.comingSoon}
                />
              }
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
