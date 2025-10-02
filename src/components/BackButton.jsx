import React from 'react';
import { Link } from 'react-router-dom';

const BackButton = () => (
  <Link to="/" style={{
    position: 'fixed',
    top: '20px',
    left: '20px',
    zIndex: 30,
    background: 'rgba(0,0,0,0.7)',
    color: 'white',
    padding: '10px 15px',
    borderRadius: '20px',
    textDecoration: 'none',
    fontSize: '14px',
    opacity: 1,
    transition: 'opacity 0.5s ease'
  }}>
    ← Назад
  </Link>
);

export default BackButton;
