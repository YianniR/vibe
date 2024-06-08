import React from 'react';
import { useSelector } from 'react-redux';

interface WebsiteGridProps {
  isEditMode: boolean;
  handleDragStart: (e: React.DragEvent, fromContainerIndex: number, fromGridIndex: number, fromWebsiteIndex: number) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent, toContainerIndex: number, toGridIndex: number) => void;
  handleAddGrid: (containerIndex: number) => void;
  handleTitleChange: (containerIndex: number, gridIndex: number, newTitle: string) => void;
  handleTileClick: (url: string) => void;
  handleDeleteWebsite: (containerIndex: number, gridIndex: number, websiteIndex: number) => void;
  handleDeleteGrid: (containerIndex: number, gridIndex: number) => void;
  handleDeleteGridContainer: (containerIndex: number) => void;
}

const WebsiteGrid: React.FC<WebsiteGridProps> = ({
  isEditMode,
  handleDragStart,
  handleDragOver,
  handleDrop,
  handleAddGrid,
  handleTitleChange,
  handleTileClick,
  handleDeleteWebsite,
  handleDeleteGrid,
  handleDeleteGridContainer
}) => {
  const gridContainers = useSelector((state: any) => state.websites.gridContainers);

  const { gridColumns } = useSelector((state: any) => state.settings);

  const gridStyles = {
    gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
  };

  return (
    <div id="gridContainersWrapper">
      {gridContainers && gridContainers.length > 0 ? (
        gridContainers.map((container: any, containerIndex: number) => (
          <div className={`grid-container ${isEditMode ? 'edit-mode' : 'render-mode'}`} key={containerIndex}>
            {isEditMode && (
              <button
                className="delete-container-button"
                onClick={() => handleDeleteGridContainer(containerIndex)}
              >
                ×
              </button>
            )}
            <div className="grids-wrapper" style={gridStyles}>
              {container.grids.map((grid: any, gridIndex: number) => (
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
                    onBlur={(e) => handleTitleChange(containerIndex, gridIndex, e.target.textContent || '')}
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
                    {grid.websites.map((website: any, websiteIndex: number) => (
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
