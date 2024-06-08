import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import HomePage from './home';
import EditPage from './edit';
import SettingsPage from './settings';

const Index: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const gridContainers = useSelector((state: any) => state.websites.gridContainers) || [];

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage gridContainers={gridContainers} />;
      case 'edit':
        return <EditPage gridContainers={gridContainers} />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <HomePage gridContainers={gridContainers} />;
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

export default Index;
