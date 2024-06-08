import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setWebsites, addWebsite, addGridContainer, addGrid, moveWebsite, updateGridTitle, deleteWebsite, deleteGrid, deleteGridContainer } from '../redux/websiteSlice';
import WebsiteGrid from '../components/WebsiteGrid';
import { loadWebsitesFromLocalStorage } from '../utils/localStorage';

interface EditPageProps {
  gridContainers: any[];
}

const EditPage: React.FC<EditPageProps> = ({ gridContainers }) => {
  const dispatch = useDispatch();
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
    let websiteUrl = url.trim();
    if (!/^https?:\/\//i.test(websiteUrl)) {
      websiteUrl = 'http://' + websiteUrl;
    }
    let faviconUrl = favicon.trim();
    if (!faviconUrl) {
      faviconUrl = `https://www.google.com/s2/favicons?domain=${new URL(websiteUrl).hostname}`;
    }
    dispatch(addWebsite({ name, url: websiteUrl, favicon: faviconUrl }));
    setName('');
    setUrl('');
    setFavicon('');
  };

  const handleAddGridContainer = () => {
    dispatch(addGridContainer());
  };

  const handleAddGrid = (containerIndex: number) => {
    dispatch(addGrid({ containerIndex }));
  };

  const handleTitleChange = (containerIndex: number, gridIndex: number, newTitle: string) => {
    dispatch(updateGridTitle({ containerIndex, gridIndex, newTitle }));
  };

  const handleDeleteWebsite = (containerIndex: number, gridIndex: number, websiteIndex: number) => {
    dispatch(deleteWebsite({ containerIndex, gridIndex, websiteIndex }));
  };

  const handleDeleteGrid = (containerIndex: number, gridIndex: number) => {
    dispatch(deleteGrid({ containerIndex, gridIndex }));
  };

  const handleDeleteGridContainer = (containerIndex: number) => {
    dispatch(deleteGridContainer({ containerIndex }));
  };

  const handleDragStart = (e: React.DragEvent, fromContainerIndex: number, fromGridIndex: number, fromWebsiteIndex: number) => {
    e.dataTransfer.setData('fromContainerIndex', fromContainerIndex.toString());
    e.dataTransfer.setData('fromGridIndex', fromGridIndex.toString());
    e.dataTransfer.setData('fromWebsiteIndex', fromWebsiteIndex.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, toContainerIndex: number, toGridIndex: number) => {
    const fromContainerIndex = parseInt(e.dataTransfer.getData('fromContainerIndex'), 10);
    const fromGridIndex = parseInt(e.dataTransfer.getData('fromGridIndex'), 10);
    const fromWebsiteIndex = parseInt(e.dataTransfer.getData('fromWebsiteIndex'), 10);
    dispatch(moveWebsite({
      fromContainerIndex,
      fromGridIndex,
      fromWebsiteIndex,
      toContainerIndex,
      toGridIndex,
    }));
  };

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
      <div className="input-group">
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Website Name" />
        <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Website URL" />
        <input type="text" value={favicon} onChange={(e) => setFavicon(e.target.value)} placeholder="Favicon URL (optional)" />
        <button onClick={handleAddWebsite}>Add Website</button>
      </div>
      <WebsiteGrid
        gridContainers={gridContainers}
        isEditMode={true}
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
      <button onClick={handleAddGridContainer} className="add-grid-container-button">
        <i className="fas fa-plus"></i>
      </button>
    </div>
  );
};

export default EditPage;
