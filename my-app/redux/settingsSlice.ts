import { createSlice } from '@reduxjs/toolkit';
import { loadSettingsFromLocalStorage, saveSettingsToLocalStorage } from '../utils/localStorage';

const initialState = loadSettingsFromLocalStorage() || {
  theme: 'light',
  gridColumns: 3,
  tileSize: 'medium',
  weatherLocation: 'London',
  bordersAndShadows: true,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTheme(state, action) {
      state.theme = action.payload;
      saveSettingsToLocalStorage(state);
    },
    setGridColumns(state, action) {
      state.gridColumns = action.payload;
      saveSettingsToLocalStorage(state);
    },
    setTileSize(state, action) {
      state.tileSize = action.payload;
      saveSettingsToLocalStorage(state);
    },
    setWeatherLocation(state, action) {
      state.weatherLocation = action.payload;
      saveSettingsToLocalStorage(state);
    },
    toggleBordersAndShadows(state) {
      state.bordersAndShadows = !state.bordersAndShadows;
      saveSettingsToLocalStorage(state);
    },
  },
});

export const { setTheme, setGridColumns, setTileSize, setWeatherLocation, toggleBordersAndShadows } = settingsSlice.actions;
export default settingsSlice.reducer;
