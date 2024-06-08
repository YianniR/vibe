import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setWebsites } from '../redux/websiteSlice';
import WebsiteGrid from '../components/WebsiteGrid';
import WeatherWidget from '../components/WeatherWidget';
import { loadWebsitesFromLocalStorage } from '../utils/localStorage';

const HomePage: React.FC = () => {
  const dispatch = useDispatch();
  const gridContainers = useSelector((state: any) => state.websites.gridContainers) || [];
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

  if (!isClient) {
    return null;
  }

  return (
    <div className="container">
      <div className="message" id="message"></div>
      <div className="clock" id="clock"></div>
      <WeatherWidget />
      <WebsiteGrid
        gridContainers={gridContainers}
        isEditMode={false}
        handleDragStart={() => {}}
        handleDragOver={() => {}}
        handleDrop={() => {}}
        handleAddGrid={() => {}}
        handleTitleChange={() => {}}
        handleTileClick={handleTileClick}
        handleDeleteWebsite={() => {}}
        handleDeleteGrid={() => {}}
        handleDeleteGridContainer={() => {}}
      />
    </div>
  );
};

export default HomePage;
