import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1 className="stickman-enter">404</h1>
      <h2 className="stickman-enter-delay">Oops! Page not found.</h2>
      <p className="stickman-enter-delay-2">The page you're looking for doesn't exist.</p>
      <Link className="stickman-enter-delay-3 stickman-pop inline-block" to="/" style={{ textDecoration: 'none', color: 'blue', fontWeight: 'bold' }}>
        Go back to Home
      </Link>
    </div>
  );
};

export default NotFound;
