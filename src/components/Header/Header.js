import React from 'react';
import './Header.css';

const Header = ({ user }) => {
  return (
    <header className="header">
      <div className="header-left">
        <img src="/logobeta.png" alt="Bloodpg BETA" className="header-logo" />
      </div>

      <div className="header-right">
        <img src="/logosupport.png" alt="Support" className="header-icon" />
        <img src="/logodiamond.png" alt="Diamond" className="header-icon" />
        {user && (
          <div className="header-user">
            <span className="header-user-name">{user.name}</span>
            <span className="header-menu">⋯</span>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

