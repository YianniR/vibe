import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setTheme,
  setWeatherLocation,
} from '../redux/settingsSlice';

const Settings: React.FC = () => {
  const dispatch = useDispatch();
  const { theme, weatherLocation } = useSelector((state: any) => state.settings);

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setTheme(e.target.value));
  };

  const handleWeatherLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setWeatherLocation(e.target.value));
  };

  return (
    <div className="container">
      <h2>Settings</h2>
      <div className="setting-item">
        <label htmlFor="theme">Theme:</label>
        <select id="theme" value={theme} onChange={handleThemeChange} className="dropdown">
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>
      <div className="setting-item">
        <label htmlFor="weather-location">Weather Location:</label>
        <input
          type="text"
          id="weather-location"
          value={weatherLocation}
          onChange={handleWeatherLocationChange}
          className="input-field"
        />
      </div>
    </div>
  );
};

export default Settings;
