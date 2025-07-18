import React from 'react';

const Gallery = ({ t }) => {
  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center">
          <div className="mb-12 sm:mb-16">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 gradient-text">
              {t.gallery.title}
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              {t.gallery.subtitle}
            </p>
          </div>
          
          {/* 施工中... */}
          <div className="flex flex-col items-center justify-center min-h-[300px] sm:min-h-[400px]">
            <div className="text-center mb-6 sm:mb-8">
              <div className="text-6xl sm:text-8xl mb-4 sm:mb-6">🚧</div>
              <div className="flex items-center justify-center gap-2 mb-4">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">{t.gallery.underConstruction.title.replace('...', '')}</h2>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-gray-800 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-gray-800 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-gray-800 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
              <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">{t.gallery.underConstruction.subtitle}</p>
            </div>
            
            <div className="mt-8 sm:mt-12 text-center">
              <p className="text-gray-500 mb-4 text-sm sm:text-base">{t.gallery.underConstruction.message}</p>
              <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                <a 
                  href="/creator" 
                  className="bg-primary-500 text-white px-4 sm:px-6 py-3 rounded-full font-medium hover:bg-primary-600 transition-colors duration-300 text-sm sm:text-base"
                >
                  {t.gallery.underConstruction.creatorButton}
                </a>
                <a 
                  href="/contact" 
                  className="bg-gray-100 text-gray-700 px-4 sm:px-6 py-3 rounded-full font-medium hover:bg-gray-200 transition-colors duration-300 text-sm sm:text-base"
                >
                  {t.gallery.underConstruction.contactButton}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Gallery; 