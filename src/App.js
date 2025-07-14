import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Hero from './components/Hero/Hero';
import About from './components/About/About';
import Skills from './components/Skills/Skills';
import Interests from './components/Interests/Interests';
import Contact from './components/Contact/Contact';
import zh from './locales/zh';
import en from './locales/en';
import './App.css';

function App() {
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
    <Router>
      <div className="App">
        <Navbar 
          currentLanguage={currentLanguage}
          onLanguageChange={handleLanguageChange}
          t={translations}
        />
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Hero t={translations} />} />
            <Route path="/about" element={<About t={translations} />} />
            <Route path="/skills" element={<Skills t={translations} />} />
            <Route path="/interests" element={<Interests t={translations} />} />
            <Route path="/contact" element={<Contact t={translations} />} />
          </Routes>
        </main>
        
        <Footer t={translations} />
      </div>
    </Router>
  );
}

export default App;
