import { createSlice } from '@reduxjs/toolkit';
import { loadWebsitesFromLocalStorage, saveWebsitesToLocalStorage } from '../utils/localStorage';

const initialState = {
  gridContainers: loadWebsitesFromLocalStorage() || [], // Ensure gridContainers is an empty array if localStorage is empty
};

const websiteSlice = createSlice({
  name: 'websites',
  initialState,
  reducers: {
    setWebsites(state, action) {
      state.gridContainers = action.payload;
    },
    addWebsite(state, action) {
      if (typeof window !== 'undefined') {
        if (state.gridContainers.length === 0) {
          state.gridContainers.push({ grids: [] });
        }
        const firstContainer = state.gridContainers[0];
        if (firstContainer.grids.length === 0) {
          firstContainer.grids.push({ title: 'New Grid', websites: [] });
        }
        const firstGrid = firstContainer.grids[0];
        firstGrid.websites.push(action.payload);
        saveWebsitesToLocalStorage(state.gridContainers);
      }
    },
    addGridContainer(state) {
      if (typeof window !== 'undefined') {
        state.gridContainers.push({ grids: [] });
        saveWebsitesToLocalStorage(state.gridContainers);
      }
    },
    addGrid(state, action) {
      if (typeof window !== 'undefined') {
        const { containerIndex } = action.payload;
        state.gridContainers[containerIndex].grids.push({ title: 'New Grid', websites: [] });
        saveWebsitesToLocalStorage(state.gridContainers);
      }
    },
    moveWebsite(state, action) {
      if (typeof window !== 'undefined') {
        const {
          fromContainerIndex,
          fromGridIndex,
          fromWebsiteIndex,
          toContainerIndex,
          toGridIndex,
        } = action.payload;
        const website = state.gridContainers[fromContainerIndex].grids[fromGridIndex].websites.splice(fromWebsiteIndex, 1)[0];
        state.gridContainers[toContainerIndex].grids[toGridIndex].websites.push(website);
        saveWebsitesToLocalStorage(state.gridContainers);
      }
    },
    updateGridTitle(state, action) {
      const { containerIndex, gridIndex, newTitle } = action.payload;
      if (state.gridContainers[containerIndex] && state.gridContainers[containerIndex].grids[gridIndex]) {
        state.gridContainers[containerIndex].grids[gridIndex] = {
          ...state.gridContainers[containerIndex].grids[gridIndex],
          title: newTitle,
        };
        saveWebsitesToLocalStorage(state.gridContainers);
      }
    }
  },
});

export const { setWebsites, addWebsite, addGridContainer, addGrid, moveWebsite, updateGridTitle } = websiteSlice.actions;
export default websiteSlice.reducer;
