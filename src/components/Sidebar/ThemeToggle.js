import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="theme-toggle">
      <button
        className={`theme-toggle-btn ${theme === 'light' ? 'theme-toggle-active' : ''}`}
        onClick={toggleTheme}
        title="Day mode"
      >
        <img src="/logolightmode.png" alt="Light mode" className="theme-toggle-icon" />
      </button>
      <button
        className={`theme-toggle-btn ${theme === 'dark' ? 'theme-toggle-active' : ''}`}
        onClick={toggleTheme}
        title="Night mode"
      >
        <img src="/logodarkmode.png" alt="Dark mode" className="theme-toggle-icon" />
      </button>
    </div>
  );
};

export default ThemeToggle;

