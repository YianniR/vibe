import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setWebsites, addWebsite, addGridContainer, addGrid, moveWebsite, updateGridTitle, deleteWebsite, deleteGrid, deleteGridContainer } from '../redux/websiteSlice';
import WebsiteGrid from '../components/WebsiteGrid';
import { loadWebsitesFromLocalStorage } from '../utils/localStorage';

const EditPage = () => {
  const dispatch = useDispatch();
  const gridContainers = useSelector((state) => state.websites.gridContainers) || [];
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

  const handleAddGrid = (containerIndex) => {
    dispatch(addGrid({ containerIndex }));
  };

  const handleTitleChange = (containerIndex, gridIndex, newTitle) => {
    dispatch(updateGridTitle({ containerIndex, gridIndex, newTitle }));
  };

  const handleDeleteWebsite = (containerIndex, gridIndex, websiteIndex) => {
    dispatch(deleteWebsite({ containerIndex, gridIndex, websiteIndex }));
  };

  const handleDeleteGrid = (containerIndex, gridIndex) => {
    dispatch(deleteGrid({ containerIndex, gridIndex }));
  };

  const handleDeleteGridContainer = (containerIndex) => {
    dispatch(deleteGridContainer({ containerIndex }));
  };

  const handleDragStart = (e, fromContainerIndex, fromGridIndex, fromWebsiteIndex) => {
    e.dataTransfer.setData('fromContainerIndex', fromContainerIndex);
    e.dataTransfer.setData('fromGridIndex', fromGridIndex);
    e.dataTransfer.setData('fromWebsiteIndex', fromWebsiteIndex);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, toContainerIndex, toGridIndex) => {
    const fromContainerIndex = e.dataTransfer.getData('fromContainerIndex');
    const fromGridIndex = e.dataTransfer.getData('fromGridIndex');
    const fromWebsiteIndex = e.dataTransfer.getData('fromWebsiteIndex');
    dispatch(moveWebsite({
      fromContainerIndex: parseInt(fromContainerIndex, 10),
      fromGridIndex: parseInt(fromGridIndex, 10),
      fromWebsiteIndex: parseInt(fromWebsiteIndex, 10),
      toContainerIndex,
      toGridIndex,
    }));
  };

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
        <button onClick={() => (window.location.href = '/')} className="nav-button">
          <i className="fas fa-home"></i>
        </button>
      </div>
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
