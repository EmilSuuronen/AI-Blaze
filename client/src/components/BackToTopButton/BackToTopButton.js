// BackToTopButton.js
import React from 'react';
import { FaArrowUp } from 'react-icons/fa';
import './BackToTopButton.css';

const BackToTopButton = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button className="back-to-top-button" onClick={scrollToTop}>
      <FaArrowUp />
    </button>
  );
};

export default BackToTopButton;
