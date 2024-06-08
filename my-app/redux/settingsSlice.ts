import { createSlice } from '@reduxjs/toolkit';
import { loadSettingsFromLocalStorage, saveSettingsToLocalStorage } from '../utils/localStorage';

const initialState = loadSettingsFromLocalStorage() || {
  theme: 'light',
  weatherLocation: 'London',
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTheme(state, action) {
      state.theme = action.payload;
      saveSettingsToLocalStorage(state);
    },
    setWeatherLocation(state, action) {
      state.weatherLocation = action.payload;
      saveSettingsToLocalStorage(state);
    },
  },
});

export const { setTheme, setWeatherLocation } = settingsSlice.actions;
export default settingsSlice.reducer;
