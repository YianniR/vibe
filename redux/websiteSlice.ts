import { createSlice } from '@reduxjs/toolkit';
import { loadWebsitesFromLocalStorage, saveWebsitesToLocalStorage } from '../utils/localStorage';

const websiteSlice = createSlice({
  name: 'websites',
  initialState: {
    gridContainers: loadWebsitesFromLocalStorage(),
  },
  reducers: {
    setWebsites(state, action) {
      state.gridContainers = action.payload;
      saveWebsitesToLocalStorage(state.gridContainers);
    },
    addWebsite(state, action) {
      const { name, url, favicon } = action.payload;
      state.gridContainers[0].grids[0].websites.push({ name, url, favicon });
      saveWebsitesToLocalStorage(state.gridContainers);
    },
    addGridContainer(state) {
      state.gridContainers.push({ grids: [] });
      saveWebsitesToLocalStorage(state.gridContainers);
    },
    addGrid(state, action) {
      const { containerIndex } = action.payload;
      if (state.gridContainers[containerIndex]) {
        state.gridContainers[containerIndex].grids.push({ title: 'New Grid', websites: [] });
        saveWebsitesToLocalStorage(state.gridContainers);
      }
    },
    updateGridTitle(state, action) {
      const { containerIndex, gridIndex, newTitle } = action.payload;
      if (state.gridContainers[containerIndex]) {
        state.gridContainers[containerIndex].grids[gridIndex].title = newTitle;
        saveWebsitesToLocalStorage(state.gridContainers);
      }
    },
    deleteWebsite(state, action) {
      const { containerIndex, gridIndex, websiteIndex } = action.payload;
      if (state.gridContainers[containerIndex]) {
        state.gridContainers[containerIndex].grids[gridIndex].websites.splice(websiteIndex, 1);
        saveWebsitesToLocalStorage(state.gridContainers);
      }
    },
    deleteGrid(state, action) {
      const { containerIndex, gridIndex } = action.payload;
      if (state.gridContainers[containerIndex]) {
        state.gridContainers[containerIndex].grids.splice(gridIndex, 1);
        saveWebsitesToLocalStorage(state.gridContainers);
      }
    },
    deleteGridContainer(state, action) {
      const { containerIndex } = action.payload;
      state.gridContainers.splice(containerIndex, 1);
      saveWebsitesToLocalStorage(state.gridContainers);
    },
    moveWebsite(state, action) {
      const { fromContainerIndex, fromGridIndex, fromWebsiteIndex, toContainerIndex, toGridIndex } = action.payload;
      if (
        state.gridContainers[fromContainerIndex] &&
        state.gridContainers[toContainerIndex]
      ) {
        const website = state.gridContainers[fromContainerIndex].grids[fromGridIndex].websites.splice(fromWebsiteIndex, 1)[0];
        state.gridContainers[toContainerIndex].grids[toGridIndex].websites.push(website);
        saveWebsitesToLocalStorage(state.gridContainers);
      }
    },
  },
});

export const {
  setWebsites,
  addWebsite,
  addGridContainer,
  addGrid,
  updateGridTitle,
  deleteWebsite,
  deleteGrid,
  deleteGridContainer,
  moveWebsite,
} = websiteSlice.actions;

export default websiteSlice.reducer;
