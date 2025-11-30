import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header/Header';
import ThemeToggle from './components/Sidebar/ThemeToggle';
import Sidebar from './components/Sidebar/Sidebar';
import MainContent from './components/MainContent/MainContent';
import './App.css';

function App() {
  const [activeMainTab, setActiveMainTab] = useState('blood-pressure');
  const [user] = useState(null); // Can be set when user signs in

  return (
    <ThemeProvider>
      <div className="app">
        <Header user={user} />
        <div className="app-body">
          <div className="left-pane-container">
            <div className="main-tabs-container">
              <button
                className={`main-tab ${activeMainTab === 'blood-pressure' ? 'main-tab-active' : ''}`}
                onClick={() => setActiveMainTab('blood-pressure')}
              >
                <img src="/logowhiteblood.png" alt="" className="main-tab-icon" />
                BLOOD PRESSURE
              </button>
              <button
                className={`main-tab ${activeMainTab === 'glucose' ? 'main-tab-active' : ''}`}
                onClick={() => setActiveMainTab('glucose')}
              >
                GLUCOSE LEVEL
              </button>
            </div>
            <div className="left-pane-content">
              <ThemeToggle />
              <Sidebar
                activeMainTab={activeMainTab}
                onMainTabChange={setActiveMainTab}
              />
            </div>
          </div>
          <MainContent />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
