import React from 'react';
import './About.css';

const About = ({ t }) => {
  return (
    <section className="about">
      <div className="about-container">
        <div className="about-header">
          <h1 className="about-title">{t.about.title}</h1>
          <p className="about-subtitle">{t.about.description}</p>
        </div>
        
        <div className="about-content">
          <div className="about-card">
            <div className="card-icon">💼</div>
            <h3 className="card-title">{t.about.experience}</h3>
            <div className="card-content">
              <div className="experience-item">
                <h4>前端开发工程师</h4>
                <p className="company">某科技公司</p>
                <p className="period">2022 - 至今</p>
                <p className="description">
                  负责公司主要产品的前端开发，使用React、TypeScript等技术栈，
                  参与过多个大型项目的开发和维护。
                </p>
              </div>
              <div className="experience-item">
                <h4>Web开发实习生</h4>
                <p className="company">某互联网公司</p>
                <p className="period">2021 - 2022</p>
                <p className="description">
                  参与公司官网和内部系统的开发，学习并应用了多种前端技术。
                </p>
              </div>
            </div>
          </div>
          
          <div className="about-card">
            <div className="card-icon">🎓</div>
            <h3 className="card-title">{t.about.education}</h3>
            <div className="card-content">
              <div className="education-item">
                <h4>计算机科学与技术</h4>
                <p className="school">某知名大学</p>
                <p className="period">2018 - 2022</p>
                <p className="description">
                  主修计算机科学，专注于软件工程和Web开发技术。
                  参与过多个学术项目和竞赛。
                </p>
              </div>
            </div>
          </div>
          
          <div className="about-card">
            <div className="card-icon">🏆</div>
            <h3 className="card-title">{t.about.achievements}</h3>
            <div className="card-content">
              <div className="achievement-item">
                <h4>优秀毕业生</h4>
                <p className="description">大学期间获得优秀毕业生称号</p>
              </div>
              <div className="achievement-item">
                <h4>技术竞赛获奖</h4>
                <p className="description">参与多次编程竞赛并获得奖项</p>
              </div>
              <div className="achievement-item">
                <h4>开源贡献</h4>
                <p className="description">为多个开源项目贡献代码</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About; 