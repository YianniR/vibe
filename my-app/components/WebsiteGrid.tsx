import React from 'react';

const WebsiteGrid = ({ gridContainers = [], isEditMode, handleDragStart, handleDragOver, handleDrop, handleAddGrid, handleTitleChange, handleTileClick, handleDeleteWebsite, handleDeleteGrid, handleDeleteGridContainer }) => {
  return (
    <div id="gridContainersWrapper">
      {gridContainers && gridContainers.length > 0 ? (
        gridContainers.map((container, containerIndex) => (
          <div className={`grid-container ${isEditMode ? 'edit-mode' : 'render-mode'}`} key={containerIndex}>
            {isEditMode && (
              <button
                className="delete-container-button"
                onClick={() => handleDeleteGridContainer(containerIndex)}
              >
                ×
              </button>
            )}
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
                  {isEditMode && (
                    <button
                      className="delete-column-button"
                      onClick={() => handleDeleteGrid(containerIndex, gridIndex)}
                    >
                      ×
                    </button>
                  )}
                  <div className="grid">
                    {grid.websites.map((website, websiteIndex) => (
                      <div
                        className="grid-item"
                        key={websiteIndex}
                        draggable={isEditMode}
                        onDragStart={(e) => isEditMode && handleDragStart(e, containerIndex, gridIndex, websiteIndex)}
                        onClick={() => !isEditMode && handleTileClick(website.url)}
                      >
                        {website.favicon && <img src={website.favicon} alt="Favicon" className="favicon" />}
                        <div>{website.name}</div>
                        {isEditMode && (
                          <button
                            className="delete-button"
                            onClick={() => handleDeleteWebsite(containerIndex, gridIndex, websiteIndex)}
                          >
                            ×
                          </button>
                        )}
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