import React, { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';

const Contact = ({ t }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    const publicKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;
    if (publicKey) {
      emailjs.init(publicKey);
    } else {
      console.error('EmailJS public key not found in environment variables');
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    const serviceId = process.env.REACT_APP_EMAILJS_SERVICE_ID;
    const templateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      console.error('EmailJS configuration missing:', { serviceId, templateId, publicKey });
      setSubmitStatus('error');
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
          to_email: 'ldydq970128@gmail.com'
        },
        publicKey
      );

      if (result.status === 200) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      }
    } catch (error) {
      console.error('Email send failed:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: '📧',
      title: t.contact.email,
      value: 'ldydq970128@gmail.com',
      link: 'mailto:ldydq970128@gmail.com'
    },
    {
      icon: '📱',
      title: t.contact.phone,
      value: '+1 9024108653',
      link: 'tel:+19024108653'
    },
    {
      icon: '📍',
      title: t.contact.location,
      value: 'Halifax, NS, CA',
      link: null
    }
  ];

  const socialLinks = [
    {
      name: t.contact.github,
      icon: '🐙',
      url: 'https://github.com/somali0128',
      color: '#333'
    },
    {
      name: t.contact.bilibili,
      icon: '📺',
      url: 'https://space.bilibili.com/290997685',
      color: '#00a1d6'
    }
  ];

  return (
    <section className="py-24 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-5xl lg:text-6xl font-extrabold mb-4 gradient-text">
            {t.contact.title}
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto mb-8">
            {t.contact.subtitle}
          </p>
          <p className="text-lg text-gray-700 leading-relaxed max-w-4xl mx-auto">
            {t.contact.description}
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">{t.contact.contactInfo}</h3>
            <div className="space-y-6 mb-8">
              {contactInfo.map((info, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-10 h-10 gradient-bg rounded-full flex items-center justify-center text-white text-lg">
                    {info.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-600 mb-1">{info.title}</h4>
                    {info.link ? (
                      <a href={info.link} className="font-semibold text-gray-900 transition-colors duration-200 hover:text-primary-600">
                        {info.value}
                      </a>
                    ) : (
                      <span className="font-semibold text-gray-900">{info.value}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-200 pt-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">{t.contact.social}</h4>
              <div className="grid grid-cols-2 gap-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-200 text-gray-700 font-medium transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                    style={{ '--tw-border-opacity': social.color ? '1' : '0.2' }}
                  >
                    <span className="text-lg">{social.icon}</span>
                    <span className="text-sm">{social.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900">{t.contact.sendMessage}</h3>
            
            {submitStatus === 'success' && (
              <div className="p-4 m-2 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800">{t.contact.messageSent}</p>
              </div>
            )}
            
            {submitStatus === 'error' && (
              <div className="p-4 m-2 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800">{t.contact.messageError}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="font-semibold text-gray-700 text-sm">{t.contact.name}</label>
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
              
              <div className="space-y-2">
                <label htmlFor="email" className="font-semibold text-gray-700 text-sm">{t.contact.emailLabel}</label>
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
              
              <div className="space-y-2">
                <label htmlFor="subject" className="font-semibold text-gray-700 text-sm">{t.contact.subject}</label>
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
              
              <div className="space-y-2">
                <label htmlFor="message" className="font-semibold text-gray-700 text-sm">{t.contact.message}</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="form-input resize-y min-h-[120px]"
                  rows="5"
                  required
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                className="btn-primary w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? t.contact.sending : t.contact.sendMessage}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact; 