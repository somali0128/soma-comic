import React from 'react';

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
    <section className="py-24 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-5xl lg:text-6xl font-extrabold mb-4 gradient-text">
            {t.interests.title}
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            {t.interests.subtitle}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {interests.map((interest, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 card-hover text-center">
              <div className="text-5xl mb-4">{interest.icon}</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{interest.title}</h3>
              <p className="text-gray-600 leading-relaxed mb-6">{interest.description}</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {interest.details.map((detail, detailIndex) => (
                  <span key={detailIndex} className="gradient-bg text-white px-3 py-1 rounded-full text-sm font-medium">
                    {detail}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-8">生活瞬间</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="aspect-square rounded-xl overflow-hidden transition-transform duration-300 hover:scale-105">
              <div className="w-full h-full gradient-bg flex flex-col items-center justify-center text-white p-4">
                <span className="text-5xl mb-2">📖</span>
                <p className="font-semibold text-lg">阅读时光</p>
              </div>
            </div>
            <div className="aspect-square rounded-xl overflow-hidden transition-transform duration-300 hover:scale-105">
              <div className="w-full h-full gradient-bg flex flex-col items-center justify-center text-white p-4">
                <span className="text-5xl mb-2">🎮</span>
                <p className="font-semibold text-lg">游戏世界</p>
              </div>
            </div>
            <div className="aspect-square rounded-xl overflow-hidden transition-transform duration-300 hover:scale-105">
              <div className="w-full h-full gradient-bg flex flex-col items-center justify-center text-white p-4">
                <span className="text-5xl mb-2">🎵</span>
                <p className="font-semibold text-lg">音乐欣赏</p>
              </div>
            </div>
            <div className="aspect-square rounded-xl overflow-hidden transition-transform duration-300 hover:scale-105">
              <div className="w-full h-full gradient-bg flex flex-col items-center justify-center text-white p-4">
                <span className="text-5xl mb-2">✈️</span>
                <p className="font-semibold text-lg">旅行记忆</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Interests; 