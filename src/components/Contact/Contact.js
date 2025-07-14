import React, { useState } from 'react';
import './Contact.css';

const Contact = ({ t }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 这里可以添加表单提交逻辑
    console.log('Form submitted:', formData);
    alert('消息已发送！我会尽快回复您。');
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  const contactInfo = [
    {
      icon: '📧',
      title: t.contact.email,
      value: 'contact@example.com',
      link: 'mailto:contact@example.com'
    },
    {
      icon: '📱',
      title: t.contact.phone,
      value: '+86 138-0000-0000',
      link: 'tel:+8613800000000'
    },
    {
      icon: '📍',
      title: t.contact.location,
      value: '中国，北京',
      link: null
    }
  ];

  const socialLinks = [
    {
      name: 'GitHub',
      icon: '🐙',
      url: 'https://github.com',
      color: '#333'
    },
    {
      name: 'LinkedIn',
      icon: '💼',
      url: 'https://linkedin.com',
      color: '#0077b5'
    },
    {
      name: 'Twitter',
      icon: '🐦',
      url: 'https://twitter.com',
      color: '#1da1f2'
    },
    {
      name: '微信',
      icon: '💬',
      url: '#',
      color: '#07c160'
    }
  ];

  return (
    <section className="contact">
      <div className="contact-container">
        <div className="contact-header">
          <h1 className="contact-title">{t.contact.title}</h1>
          <p className="contact-subtitle">{t.contact.subtitle}</p>
        </div>
        
        <div className="contact-content">
          <div className="contact-info">
            <h3 className="info-title">联系信息</h3>
            <div className="info-list">
              {contactInfo.map((info, index) => (
                <div key={index} className="info-item">
                  <div className="info-icon">{info.icon}</div>
                  <div className="info-content">
                    <h4 className="info-label">{info.title}</h4>
                    {info.link ? (
                      <a href={info.link} className="info-value">
                        {info.value}
                      </a>
                    ) : (
                      <span className="info-value">{info.value}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="social-links">
              <h4 className="social-title">{t.contact.social}</h4>
              <div className="social-grid">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link"
                    style={{ '--social-color': social.color }}
                  >
                    <span className="social-icon">{social.icon}</span>
                    <span className="social-name">{social.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
          
          <div className="contact-form">
            <h3 className="form-title">发送消息</h3>
            <form onSubmit={handleSubmit} className="form">
              <div className="form-group">
                <label htmlFor="name" className="form-label">姓名</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email" className="form-label">邮箱</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="subject" className="form-label">主题</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="message" className="form-label">消息</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="form-textarea"
                  rows="5"
                  required
                ></textarea>
              </div>
              
              <button type="submit" className="form-submit">
                发送消息
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact; 