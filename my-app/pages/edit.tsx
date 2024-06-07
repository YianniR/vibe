import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setWebsites, addWebsite, addGridContainer, addGrid, moveWebsite, updateGridTitle } from '../redux/websiteSlice';
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
    dispatch(addWebsite({ name, url, favicon }));
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
    window.open(url, '_blank');
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
      />
      <button onClick={handleAddGridContainer} className="add-grid-container-button">
        <i className="fas fa-plus"></i>
      </button>
    </div>
  );
};

export default EditPage;
