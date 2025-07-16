import React from 'react';

const Developer = ({ t }) => {
  const skillCategories = [
    {
      title: t.developer.frontend,
      icon: '💻',
      skills: [
        { name: 'React', level: 90 },
        { name: 'JavaScript', level: 85 },
        { name: 'TypeScript', level: 80 },
        { name: 'HTML/CSS', level: 95 },
        { name: 'Vue.js', level: 75 },
        { name: 'Tailwind CSS', level: 85 }
      ]
    },
    {
      title: t.developer.backend,
      icon: '⚙️',
      skills: [
        { name: 'Node.js', level: 80 },
        { name: 'Python', level: 75 },
        { name: 'Express.js', level: 85 },
        { name: 'MongoDB', level: 70 },
        { name: 'PostgreSQL', level: 65 },
        { name: 'RESTful APIs', level: 85 }
      ]
    },
    {
      title: t.developer.design,
      icon: '🎨',
      skills: [
        { name: 'UI/UX Design', level: 75 },
        { name: 'Figma', level: 80 },
        { name: 'Adobe Photoshop', level: 70 },
        { name: 'Responsive Design', level: 90 },
        { name: 'Prototyping', level: 75 },
        { name: 'Design Systems', level: 70 }
      ]
    },
    {
      title: t.developer.tools,
      icon: '🛠️',
      skills: [
        { name: 'Git', level: 90 },
        { name: 'Docker', level: 70 },
        { name: 'Webpack', level: 75 },
        { name: 'VS Code', level: 95 },
        { name: 'Postman', level: 80 },
        { name: 'Jest', level: 75 }
      ]
    }
  ];

  return (
    <section className="py-24 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-5xl lg:text-6xl font-extrabold mb-4 gradient-text">
            {t.developer.title}
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto mb-8">
            {t.developer.subtitle}
          </p>
          <p className="text-lg text-gray-700 leading-relaxed max-w-4xl mx-auto">
            {t.developer.description}
          </p>
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 mb-16">
          {skillCategories.map((category, index) => (
            <div key={index} className="bg-gray-50 rounded-2xl p-8 border border-gray-200 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center gap-4 mb-8">
                <div className="text-4xl">{category.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900">{category.title}</h3>
              </div>
              
              <div className="space-y-6">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skillIndex} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-700">{skill.name}</span>
                      <span className="font-semibold text-primary-600 text-sm">{skill.level}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="skill-progress"
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{t.developer.education}</h3>
            <p className="text-gray-600">计算机科学与技术学士学位</p>
          </div>
          <div className="text-center p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200">
            <div className="text-4xl mb-4">💼</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{t.developer.experience}</h3>
            <p className="text-gray-600">5年+ 前端开发经验</p>
          </div>
          <div className="text-center p-8 bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl border border-purple-200">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{t.developer.achievements}</h3>
            <p className="text-gray-600">多个成功项目交付</p>
          </div>
        </div>
        
        <div className="text-center">
          <div className="gradient-bg text-white rounded-2xl p-12 max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold mb-4">技术栈概览</h3>
            <p className="text-lg leading-relaxed opacity-90">
              我专注于现代Web开发技术，具备全栈开发能力。擅长使用React生态系统构建高性能的用户界面，同时也具备后端开发和数据库设计经验。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Developer; 