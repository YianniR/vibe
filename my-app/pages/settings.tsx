import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme, setGridColumns, setTileSize, setWeatherLocation, toggleBordersAndShadows } from '../redux/settingsSlice';

const SettingsPage: React.FC = () => {
  const dispatch = useDispatch();
  const settings = useSelector((state: any) => state.settings);

  const [theme, setThemeState] = useState(settings.theme);
  const [columns, setColumns] = useState(settings.gridColumns);
  const [tileSize, setTileSizeState] = useState(settings.tileSize);
  const [weatherLocation, setWeatherLocationState] = useState(settings.weatherLocation);

  useEffect(() => {
    setThemeState(settings.theme);
    setColumns(settings.gridColumns);
    setTileSizeState(settings.tileSize);
    setWeatherLocationState(settings.weatherLocation);
  }, [settings]);

  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTheme = event.target.value;
    setThemeState(selectedTheme);
    dispatch(setTheme(selectedTheme));
  };

  const handleColumnsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const numColumns = parseInt(event.target.value, 10);
    setColumns(numColumns);
    dispatch(setGridColumns(numColumns));
  };

  const handleTileSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSize = event.target.value;
    setTileSizeState(selectedSize);
    dispatch(setTileSize(selectedSize));
  };

  const handleWeatherLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const location = event.target.value;
    setWeatherLocationState(location);
    dispatch(setWeatherLocation(location));
  };

  const handleToggleBorders = () => {
    dispatch(toggleBordersAndShadows());
  };

  return (
    <div className="container">
      <h1>Settings</h1>
      <div className="settings-section">
        <h2>Theme</h2>
        <select value={theme} onChange={handleThemeChange}>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>
      <div className="settings-section">
        <h2>Grid Layout</h2>
        <label>
          Number of Columns:
          <input type="number" value={columns} onChange={handleColumnsChange} min="1" max="5" />
        </label>
        <label>
          Tile Size:
          <select value={tileSize} onChange={handleTileSizeChange}>
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </label>
        <button onClick={handleToggleBorders}>Toggle Borders and Shadows</button>
      </div>
      <div className="settings-section">
        <h2>Weather Widget</h2>
        <label>
          Location:
          <input type="text" value={weatherLocation} onChange={handleWeatherLocationChange} />
        </label>
      </div>
    </div>
  );
};

export default SettingsPage;
