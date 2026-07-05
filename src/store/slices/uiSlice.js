import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isDarkMode: false,
  isMobileMenuOpen: false,
  activeModal: null,
  toasts: [],
  isSearching: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleDarkMode(state) {
      state.isDarkMode = !state.isDarkMode;
    },
    toggleMobileMenu(state) {
      state.isMobileMenuOpen = !state.isMobileMenuOpen;
    },
    setModal(state, action) {
      state.activeModal = action.payload;
    },
    addToast(state, action) {
      state.toasts.push({ id: Date.now(), ...action.payload });
    },
    removeToast(state, action) {
      state.toasts = state.toasts.filter(t => t.id !== action.payload);
    },
    setSearching(state, action) {
      state.isSearching = action.payload;
    },
  },
});

export const { toggleDarkMode, toggleMobileMenu, setModal, addToast, removeToast, setSearching } = uiSlice.actions;
export default uiSlice.reducer;
