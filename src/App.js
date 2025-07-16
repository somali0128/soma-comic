import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Hero from './components/Hero/Hero';
import Developer from './components/Developer/Developer';
import Creator from './components/Creator/Creator';
import Gallery from './components/Gallery/Gallery';
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
            <Route path="/developer" element={<Developer t={translations} />} />
            <Route path="/creator" element={<Creator t={translations} />} />
            <Route path="/gallery" element={<Gallery t={translations} />} />
            <Route path="/contact" element={<Contact t={translations} />} />
          </Routes>
        </main>
        
        <Footer t={translations} />
      </div>
    </Router>
  );
}

export default App;
