import React from 'react';

const Creator = ({ t }) => {
  return (
    <section className="py-24 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-5xl lg:text-6xl font-extrabold mb-4 gradient-text">
            {t.creator.title}
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto mb-8">
            {t.creator.subtitle}
          </p>
          <p className="text-lg text-gray-700 leading-relaxed max-w-4xl mx-auto">
            {t.creator.description}
          </p>
        </div>
        
        {/* Bilibili UP主经历 */}
        <div className="mb-16">
          <div className="bg-gradient-to-br from-pink-50 to-red-50 rounded-2xl p-8 border border-pink-200">
            <div className="flex items-center gap-4 mb-6">
              <div className="text-4xl">📺</div>
              <h3 className="text-2xl font-bold text-gray-900">{t.creator.bilibili.title}</h3>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <p className="text-gray-700 leading-relaxed mb-6">
                  {t.creator.bilibili.description}
                </p>
                
                <div className="space-y-4">
                  {t.creator.bilibili.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                      <span className="text-gray-700 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col items-center justify-center">
                <div className="text-center mb-4">
                  <div className="text-3xl mb-2">🎯</div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">{t.creator.bilibili.channelTitle}</h4>
                  <p className="text-gray-600 text-sm mb-4">{t.creator.bilibili.channelSubtitle}</p>
                </div>
                
                <a 
                  href="https://space.bilibili.com/290997685" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-2"
                >
                  <span>📺</span>
                  <span>{t.creator.bilibili.visitButton}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bilibili视频展示 */}
        <div className="mb-16">
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{t.creator.bilibili.videoTitle}</h3>
              <p className="text-gray-600">{t.creator.bilibili.videoSubtitle}</p>
            </div>
            
            <div className="flex justify-center">
              <div className="relative w-full max-w-4xl">
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                  <iframe 
                    src="//player.bilibili.com/player.html?isOutside=true&aid=925900056&bvid=BV1kT4y1E7KA&cid=198464384&p=1" 
                    scrolling="no" 
                    border="0" 
                    frameBorder="no" 
                    frameSpacing="0" 
                    allowFullScreen="true"
                    className="absolute top-0 left-0 w-full h-full rounded-lg"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <div className="gradient-bg text-white rounded-2xl p-12 max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold mb-4">创作历程</h3>
            <p className="text-lg leading-relaxed opacity-90 mb-6">
              从最初的涂鸦到现在的数字艺术创作，我的创作之路充满了探索和学习。每一次创作都是一次成长的机会，让我不断突破自己的边界。
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold mb-2">100+</div>
                <div className="text-sm opacity-80">完成项目</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">5年+</div>
                <div className="text-sm opacity-80">创作经验</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">20+</div>
                <div className="text-sm opacity-80">合作项目</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Creator; 