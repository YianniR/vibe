import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setWebsites } from '../redux/websiteSlice';
import WebsiteGrid from '../components/WebsiteGrid';
import WeatherWidget from '../components/WeatherWidget';
import { loadWebsitesFromLocalStorage } from '../utils/localStorage';

const HomePage = () => {
  const dispatch = useDispatch();
  const gridContainers = useSelector((state) => state.websites.gridContainers) || [];
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const websites = loadWebsitesFromLocalStorage();
    dispatch(setWebsites(websites));
  }, [dispatch]);

  const handleTileClick = (url) => {
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
      <div className="navigation">
        <button onClick={() => (window.location.href = '/edit')} className="nav-button">
          <i className="fas fa-pencil-alt"></i>
        </button>
        <button onClick={() => (window.location.href = '/settings')} className="nav-button">
          <i className="fas fa-cog"></i>
        </button>
      </div>
      <div className="message" id="message"></div>
      <div className="clock" id="clock"></div>
      <WeatherWidget />
      <WebsiteGrid
        gridContainers={gridContainers}
        handleTileClick={handleTileClick}
      />
    </div>
  );
};

export default HomePage;
