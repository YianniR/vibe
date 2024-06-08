import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setWebsites } from '../redux/websiteSlice';
import WebsiteGrid from '../components/WebsiteGrid';
import WeatherWidget from '../components/WeatherWidget';
import { loadWebsitesFromLocalStorage } from '../utils/localStorage';

const HomePage = () => {
  const dispatch = useDispatch();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const websites = loadWebsitesFromLocalStorage();
    dispatch(setWebsites(websites));
  }, [dispatch]);

  const handleTileClick = (url: string) => {
    if (!/^https?:\/\//i.test(url)) {
      url = 'http://' + url;
    }
    window.location.href = url;
  };

  const handleDragStart = () => {};
  const handleDragOver = () => {};
  const handleDrop = () => {};
  const handleAddGrid = () => {};
  const handleTitleChange = () => {};
  const handleDeleteWebsite = () => {};
  const handleDeleteGrid = () => {};
  const handleDeleteGridContainer = () => {};

  if (!isClient) {
    return null;
  }

  return (
    <div className="container">
      <div className="message" id="message"></div>
      <div className="clock" id="clock"></div>
      <WeatherWidget />
      <WebsiteGrid
        isEditMode={false}
        handleDragStart={handleDragStart}
        handleDragOver={handleDragOver}
        handleDrop={handleDrop}
        handleAddGrid={handleAddGrid}
        handleTitleChange={handleTitleChange}
        handleTileClick={handleTileClick}
        handleDeleteWebsite={handleDeleteWebsite}
        handleDeleteGrid={handleDeleteGrid}
        handleDeleteGridContainer={handleDeleteGridContainer}
      />
    </div>
  );
};

export default HomePage;
