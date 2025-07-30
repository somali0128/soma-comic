import React, { useState, useEffect } from 'react';

const MessageBoard = ({ t }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);

  // API基础URL配置
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  // 调试信息
  useEffect(() => {
    console.log('API Base URL:', API_BASE_URL);
    console.log('Environment:', process.env.NODE_ENV);
  }, [API_BASE_URL]);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      console.log('Fetching messages from:', `${API_BASE_URL}/messages`);
      const response = await fetch(`${API_BASE_URL}/messages`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Messages fetched:', data);
        setMessages(data);
      } else {
        console.error('Failed to fetch messages:', response.status, response.statusText);
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      setSubmitStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = t.messageboard.validation.nameRequired;
    }

    if (!formData.email.trim()) {
      newErrors.email = t.messageboard.validation.emailRequired;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t.messageboard.validation.emailInvalid;
    }

    if (!formData.message.trim()) {
      newErrors.message = t.messageboard.validation.messageRequired;
    } else if (formData.message.trim().length < 10) {
      newErrors.message = t.messageboard.validation.messageMinLength;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 清除对应字段的错误
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    setSubmitStatus(null);

    try {
      console.log('Submitting message to:', `${API_BASE_URL}/messages`);
      console.log('Message data:', formData);
      
      const response = await fetch(`${API_BASE_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('Submit response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('Message submitted successfully:', result);
        setSubmitStatus('success');
        setFormData({ name: '', email: '', message: '' });
        // 重新获取留言列表
        await fetchMessages();
      } else {
        const errorData = await response.text();
        console.error('Submit failed:', response.status, errorData);
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting message:', error);
      setSubmitStatus('error');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t.messageboard.title}
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-2">
            {t.messageboard.subtitle}
          </p>
          <p className="text-sm sm:text-base text-gray-500 max-w-2xl mx-auto">
            {t.messageboard.description}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
          {/* 留言表单 */}
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
              {t.messageboard.writeMessage}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  {t.messageboard.name} *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder={t.messageboard.placeholder.name}
                  className={`w-full px-3 sm:px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200 text-sm sm:text-base ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  {t.messageboard.email} *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder={t.messageboard.placeholder.email}
                  className={`w-full px-3 sm:px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200 text-sm sm:text-base ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  {t.messageboard.message} *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder={t.messageboard.placeholder.message}
                  rows="6"
                  className={`w-full px-3 sm:px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200 resize-none text-sm sm:text-base ${
                    errors.message ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-600">{errors.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-primary-600 hover:to-primary-700 focus:ring-4 focus:ring-primary-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                {submitting ? t.messageboard.submitting : t.messageboard.submit}
              </button>

              {submitStatus === 'success' && (
                <div className="p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 text-sm sm:text-base">{t.messageboard.messageSent}</p>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-sm sm:text-base">{t.messageboard.messageError}</p>
                  <p className="text-red-600 text-xs sm:text-sm mt-1">
                    API URL: {API_BASE_URL}
                  </p>
                </div>
              )}
            </form>
          </div>

          {/* 留言列表 */}
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
              {t.messageboard.recentMessages}
            </h2>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
                <p className="mt-2 text-gray-500 text-sm sm:text-base">{t.messageboard.loading}</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 text-4xl sm:text-6xl mb-4">💬</div>
                <p className="text-gray-500 text-sm sm:text-base">{t.messageboard.noMessages}</p>
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-6 max-h-80 sm:max-h-96 overflow-y-auto">
                {messages.map((message) => (
                  <div key={message.id} className="border-b border-gray-200 pb-4 sm:pb-6 last:border-b-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{message.name}</h3>
                      <span className="text-xs sm:text-sm text-gray-500">
                        {formatDate(message.createdAt)}
                      </span>
                    </div>
                    <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{message.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBoard; 