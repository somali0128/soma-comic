import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>404</h1>
      <h2>Oops! Page not found.</h2>
      <p>The page you're looking for doesn't exist.</p>
      <Link to="/" style={{ textDecoration: 'none', color: 'blue', fontWeight: 'bold' }}>
        Go back to Home
      </Link>
    </div>
  );
};

export default NotFound;
