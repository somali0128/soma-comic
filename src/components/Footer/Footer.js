import React from 'react';
import SomaLogo from '../../soma_logo.svg';

const Footer = ({ t }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="gradient-bg text-white py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <img src={SomaLogo} alt="Stick Soma Logo" className="w-8 h-8" />
              <span className="text-xl font-bold gradient-text">
                Stick Soma
              </span>
            </div>
            <p className="text-gray-300 leading-relaxed">
              个人主页项目，展示我的技能、兴趣和联系方式。
            </p>
          </div>
          
          <div className="flex flex-col gap-4">
            <h4 className="text-lg font-semibold text-gray-200">快速链接</h4>
            <ul className="flex flex-col gap-2">
              <li><a href="/" className="text-gray-300 font-medium transition-colors duration-200 hover:text-white">首页</a></li>
              <li><a href="/about" className="text-gray-300 font-medium transition-colors duration-200 hover:text-white">关于我</a></li>
              <li><a href="/skills" className="text-gray-300 font-medium transition-colors duration-200 hover:text-white">技能</a></li>
              <li><a href="/contact" className="text-gray-300 font-medium transition-colors duration-200 hover:text-white">联系</a></li>
            </ul>
          </div>
          
          <div className="flex flex-col gap-4">
            <h4 className="text-lg font-semibold text-gray-200">联系方式</h4>
            <ul className="flex flex-col gap-2">
              <li><a href="mailto:contact@example.com" className="text-gray-300 font-medium transition-colors duration-200 hover:text-white">邮箱</a></li>
              <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 font-medium transition-colors duration-200 hover:text-white">GitHub</a></li>
              <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 font-medium transition-colors duration-200 hover:text-white">LinkedIn</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/20 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-300 text-sm">
            © {currentYear} Stick Soma. {t.footer.copyright}
          </p>
          <p className="text-gray-300 text-sm">
            {t.footer.madeWith}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 