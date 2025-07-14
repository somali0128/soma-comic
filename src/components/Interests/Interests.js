import React from 'react';
import './Interests.css';

const Interests = ({ t }) => {
  const interests = [
    {
      title: t.interests.reading,
      icon: '📚',
      description: '我喜欢阅读各种类型的书籍，特别是技术类、科幻小说和哲学类书籍。通过阅读，我能够不断学习新知识，拓展视野。',
      details: ['技术书籍', '科幻小说', '哲学思考', '历史传记']
    },
    {
      title: t.interests.gaming,
      icon: '🎮',
      description: '游戏不仅是娱乐，也是我了解新技术和设计理念的途径。我喜欢策略游戏和独立游戏，它们往往有独特的创意。',
      details: ['策略游戏', '独立游戏', 'RPG游戏', '多人竞技']
    },
    {
      title: t.interests.music,
      icon: '🎵',
      description: '音乐是我生活中不可或缺的一部分。我喜欢各种类型的音乐，从古典到现代，从流行到电子音乐。',
      details: ['古典音乐', '流行音乐', '电子音乐', '爵士乐']
    },
    {
      title: t.interests.travel,
      icon: '✈️',
      description: '旅行让我能够体验不同的文化，结识新朋友，获得新的灵感。我喜欢探索新的地方，记录美好的瞬间。',
      details: ['城市探索', '自然风光', '文化体验', '美食之旅']
    }
  ];

  return (
    <section className="interests">
      <div className="interests-container">
        <div className="interests-header">
          <h1 className="interests-title">{t.interests.title}</h1>
          <p className="interests-subtitle">{t.interests.subtitle}</p>
        </div>
        
        <div className="interests-grid">
          {interests.map((interest, index) => (
            <div key={index} className="interest-card">
              <div className="interest-icon">{interest.icon}</div>
              <h3 className="interest-title">{interest.title}</h3>
              <p className="interest-description">{interest.description}</p>
              <div className="interest-details">
                {interest.details.map((detail, detailIndex) => (
                  <span key={detailIndex} className="interest-tag">
                    {detail}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="interests-gallery">
          <h3 className="gallery-title">生活瞬间</h3>
          <div className="gallery-grid">
            <div className="gallery-item">
              <div className="gallery-placeholder">
                <span>📖</span>
                <p>阅读时光</p>
              </div>
            </div>
            <div className="gallery-item">
              <div className="gallery-placeholder">
                <span>🎮</span>
                <p>游戏世界</p>
              </div>
            </div>
            <div className="gallery-item">
              <div className="gallery-placeholder">
                <span>🎵</span>
                <p>音乐欣赏</p>
              </div>
            </div>
            <div className="gallery-item">
              <div className="gallery-placeholder">
                <span>✈️</span>
                <p>旅行记忆</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Interests; 