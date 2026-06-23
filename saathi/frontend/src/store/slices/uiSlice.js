import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    darkMode: localStorage.getItem('saathi_dark') === 'true',
    sidebarOpen: true,
    comfortRoomOpen: false,
  },
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem('saathi_dark', state.darkMode);
      document.documentElement.setAttribute('data-theme', state.darkMode ? 'dark' : 'light');
    },
    toggleSidebar: (state) => { state.sidebarOpen = !state.sidebarOpen; },
    setComfortRoom: (state, action) => { state.comfortRoomOpen = action.payload; },
  },
});

export const { toggleDarkMode, toggleSidebar, setComfortRoom } = uiSlice.actions;
export default uiSlice.reducer;
