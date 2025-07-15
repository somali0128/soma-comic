import React from 'react';

const About = ({ t }) => {
  return (
    <section className="py-24 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-5xl lg:text-6xl font-extrabold mb-4 gradient-text">
            {t.about.title}
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            {t.about.description}
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 card-hover">
            <div className="text-5xl mb-4">💼</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">{t.about.experience}</h3>
            <div className="space-y-6">
              <div className="pb-6 border-b border-gray-100">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">前端开发工程师</h4>
                <p className="font-semibold text-primary-600 mb-1">某科技公司</p>
                <p className="text-sm text-gray-500 mb-3">2022 - 至今</p>
                <p className="text-gray-600 leading-relaxed">
                  负责公司主要产品的前端开发，使用React、TypeScript等技术栈，
                  参与过多个大型项目的开发和维护。
                </p>
              </div>
              <div className="pb-6 border-b border-gray-100">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Web开发实习生</h4>
                <p className="font-semibold text-primary-600 mb-1">某互联网公司</p>
                <p className="text-sm text-gray-500 mb-3">2021 - 2022</p>
                <p className="text-gray-600 leading-relaxed">
                  参与公司官网和内部系统的开发，学习并应用了多种前端技术。
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 card-hover">
            <div className="text-5xl mb-4">🎓</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">{t.about.education}</h3>
            <div className="space-y-6">
              <div className="pb-6 border-b border-gray-100">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">计算机科学与技术</h4>
                <p className="font-semibold text-primary-600 mb-1">某知名大学</p>
                <p className="text-sm text-gray-500 mb-3">2018 - 2022</p>
                <p className="text-gray-600 leading-relaxed">
                  主修计算机科学，专注于软件工程和Web开发技术。
                  参与过多个学术项目和竞赛。
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 card-hover">
            <div className="text-5xl mb-4">🏆</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">{t.about.achievements}</h3>
            <div className="space-y-6">
              <div className="pb-6 border-b border-gray-100">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">优秀毕业生</h4>
                <p className="text-gray-600 leading-relaxed">大学期间获得优秀毕业生称号</p>
              </div>
              <div className="pb-6 border-b border-gray-100">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">技术竞赛获奖</h4>
                <p className="text-gray-600 leading-relaxed">参与多次编程竞赛并获得奖项</p>
              </div>
              <div className="pb-6 border-b border-gray-100">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">开源贡献</h4>
                <p className="text-gray-600 leading-relaxed">为多个开源项目贡献代码</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About; 