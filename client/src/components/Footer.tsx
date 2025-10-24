import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <p className="footer-credit">Hecho por <strong>Juan Manuel Zafra Hernández</strong></p>
        <div className="footer-links">
          <a href="mailto:juanmazh.dev@gmail.com" className="footer-link">juanmazh.dev@gmail.com</a>
          <span className="footer-sep">│</span>
          <a href="https://github.com/juanmazh/" target="_blank" rel="noopener noreferrer" className="footer-link">github.com/juanmazh</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
