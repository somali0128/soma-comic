import React from 'react';

const PlaceholderPage = ({ title, subtitle }) => (
  <section className="pt-24 px-4 sm:px-6 max-w-3xl mx-auto min-h-[65vh] pb-16">
    <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
    <p className="mt-4 text-gray-600 text-lg">{subtitle}</p>
  </section>
);

export default PlaceholderPage;
