import React, { useState } from 'react';
import HomePage from './home';
import EditPage from './edit';
import SettingsPage from './settings';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'edit':
        return <EditPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="app-container">
      <div className="navigation">
        <button onClick={() => setCurrentPage('home')} className="nav-button">
          <i className="fas fa-home"></i>
        </button>
        <button onClick={() => setCurrentPage('edit')} className="nav-button">
          <i className="fas fa-pencil-alt"></i>
        </button>
        <button onClick={() => setCurrentPage('settings')} className="nav-button">
          <i className="fas fa-cog"></i>
        </button>
      </div>
      {renderPage()}
    </div>
  );
};

export default App;
