import React from 'react';
import './Skills.css';

const Skills = ({ t }) => {
  const skillCategories = [
    {
      title: t.skills.frontend,
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
      title: t.skills.backend,
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
      title: t.skills.design,
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
      title: t.skills.tools,
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
    <section className="skills">
      <div className="skills-container">
        <div className="skills-header">
          <h1 className="skills-title">{t.skills.title}</h1>
          <p className="skills-subtitle">{t.skills.subtitle}</p>
        </div>
        
        <div className="skills-content">
          {skillCategories.map((category, index) => (
            <div key={index} className="skill-category">
              <div className="category-header">
                <div className="category-icon">{category.icon}</div>
                <h3 className="category-title">{category.title}</h3>
              </div>
              
              <div className="skills-grid">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skillIndex} className="skill-item">
                    <div className="skill-info">
                      <span className="skill-name">{skill.name}</span>
                      <span className="skill-level">{skill.level}%</span>
                    </div>
                    <div className="skill-bar">
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
        
        <div className="skills-summary">
          <div className="summary-card">
            <h3>技术栈概览</h3>
            <p>我专注于现代Web开发技术，具备全栈开发能力。擅长使用React生态系统构建高性能的用户界面，同时也具备后端开发和数据库设计经验。</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills; 