import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setWebsites,
  addWebsite,
  addGridContainer,
  addGrid,
  moveWebsite,
  updateGridTitle,
  deleteWebsite,
  deleteGrid,
  deleteGridContainer,
} from '../redux/websiteSlice';
import WebsiteGrid from '../components/WebsiteGrid';
import { loadWebsitesFromLocalStorage } from '../utils/localStorage';
import { Utils } from '../utils/utils';

const EditPage: React.FC = () => {
  const dispatch = useDispatch();
  const gridContainers = useSelector((state: any) => state.websites.gridContainers) || [];
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [favicon, setFavicon] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const websites = loadWebsitesFromLocalStorage();
    dispatch(setWebsites(websites));
  }, [dispatch]);

  const handleAddWebsite = () => {
    let formattedUrl = Utils.addHttp(url.trim());
    let faviconUrl = favicon.trim();
    if (!faviconUrl) {
      faviconUrl = `https://www.google.com/s2/favicons?domain=${new URL(formattedUrl).hostname}`;
    }
    dispatch(addWebsite({ name, url: formattedUrl, favicon: faviconUrl }));
    setName('');
    setUrl('');
    setFavicon('');
  };

  const handleDragStart = (e: React.DragEvent, fromContainerIndex: number, fromGridIndex: number, fromWebsiteIndex: number) => {
    e.dataTransfer.setData('text/plain', `${fromContainerIndex},${fromGridIndex},${fromWebsiteIndex}`);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, toContainerIndex: number, toGridIndex: number) => {
    e.preventDefault();
    const [fromContainerIndex, fromGridIndex, fromWebsiteIndex] = e.dataTransfer.getData('text').split(',').map(Number);
    dispatch(moveWebsite({ fromContainerIndex, fromGridIndex, fromWebsiteIndex, toContainerIndex, toGridIndex }));
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="container">
      <div className="input-group">
        <input
          type="text"
          placeholder="Website Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-field"
        />
        <input
          type="text"
          placeholder="Website URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="input-field"
        />
        <input
          type="text"
          placeholder="Favicon URL (optional)"
          value={favicon}
          onChange={(e) => setFavicon(e.target.value)}
          className="input-field"
        />
        <button onClick={handleAddWebsite} className="add-website-button">Add Website</button>
      </div>
      <WebsiteGrid
        isEditMode={true}
        handleDragStart={handleDragStart}
        handleDragOver={handleDragOver}
        handleDrop={handleDrop}
        handleAddGrid={(containerIndex) => {
          if (gridContainers[containerIndex]) {
            dispatch(addGrid({ containerIndex }));
          }
        }}
        handleTitleChange={(containerIndex, gridIndex, newTitle) => dispatch(updateGridTitle({ containerIndex, gridIndex, newTitle }))}
        handleTileClick={() => {}}
        handleDeleteWebsite={(containerIndex, gridIndex, websiteIndex) => dispatch(deleteWebsite({ containerIndex, gridIndex, websiteIndex }))}
        handleDeleteGrid={(containerIndex, gridIndex) => dispatch(deleteGrid({ containerIndex, gridIndex }))}
        handleDeleteGridContainer={(containerIndex) => dispatch(deleteGridContainer({ containerIndex }))}
      />
      <button className="add-grid-container-button" onClick={() => dispatch(addGridContainer())}>
        <i className="fas fa-plus"></i>
      </button>
    </div>
  );
};

export default EditPage;
