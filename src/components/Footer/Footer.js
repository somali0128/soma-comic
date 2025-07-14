import React from 'react';
import './Footer.css';

const Footer = ({ t }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">Soma Comic</h3>
            <p className="footer-description">
              个人主页项目，展示我的技能、兴趣和联系方式。
            </p>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-subtitle">快速链接</h4>
            <ul className="footer-links">
              <li><a href="/" className="footer-link">首页</a></li>
              <li><a href="/about" className="footer-link">关于我</a></li>
              <li><a href="/skills" className="footer-link">技能</a></li>
              <li><a href="/contact" className="footer-link">联系</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-subtitle">联系方式</h4>
            <ul className="footer-links">
              <li><a href="mailto:contact@example.com" className="footer-link">邮箱</a></li>
              <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" className="footer-link">GitHub</a></li>
              <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="footer-link">LinkedIn</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p className="footer-copyright">
            © {currentYear} Soma Comic. {t.footer.copyright}
          </p>
          <p className="footer-made-with">
            {t.footer.madeWith}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 