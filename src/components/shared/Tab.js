import React from 'react';
import './Tab.css';

const Tab = ({ children, active, onClick, icon, className = '' }) => {
  return (
    <button
      className={`tab ${active ? 'tab-active' : ''} ${className}`}
      onClick={onClick}
    >
      {icon && <span className="tab-icon">{icon}</span>}
      {children}
    </button>
  );
};

export default Tab;

