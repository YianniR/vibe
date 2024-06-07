import React from 'react';

const WebsiteGrid = ({ gridContainers = [], isEditMode, handleDragStart, handleDragOver, handleDrop, handleAddGrid, handleTitleChange, handleTileClick }) => {
  return (
    <div id="gridContainersWrapper">
      {gridContainers && gridContainers.length > 0 ? (
        gridContainers.map((container, containerIndex) => (
          <div className={`grid-container ${isEditMode ? 'edit-mode' : 'render-mode'}`} key={containerIndex}>
            <div className="grids-wrapper">
              {container.grids.map((grid, gridIndex) => (
                <div
                  className="grid-column"
                  key={gridIndex}
                  onDragOver={(e) => isEditMode && handleDragOver(e)}
                  onDrop={(e) => isEditMode && handleDrop(e, containerIndex, gridIndex)}
                >
                  <div
                    className="grid-title"
                    contentEditable={isEditMode}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => handleTitleChange(containerIndex, gridIndex, e.target.textContent)}
                  >
                    {grid.title}
                  </div>
                  <div className="grid">
                    {grid.websites.map((website, websiteIndex) => (
                      <div
                        className="grid-item"
                        key={websiteIndex}
                        draggable={isEditMode}
                        onDragStart={(e) => isEditMode && handleDragStart(e, containerIndex, gridIndex, websiteIndex)}
                        onClick={() => !isEditMode && handleTileClick(website.url)}
                      >
                        {website.favicon && <img src={website.favicon} alt="Favicon" />}
                        <div>{website.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {isEditMode && container.grids.length < 5 && (
                <button
                  className="add-grid-button"
                  onClick={() => handleAddGrid(containerIndex)}
                >
                  <i className="fas fa-plus"></i>
                </button>
              )}
            </div>
          </div>
        ))
      ) : (
        <p>No grids available.</p>
      )}
    </div>
  );
};

export default WebsiteGrid;
