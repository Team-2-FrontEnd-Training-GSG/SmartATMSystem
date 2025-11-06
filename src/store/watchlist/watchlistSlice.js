import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const watchlistSlice = createSlice({
  name: "watchlist",
  initialState,
  reducers: {
    toggle(state, action) {
      const code = action.payload;
      const exists = state.items.includes(code);
      state.items = exists
        ? state.items.filter((c) => c !== code)
        : [...state.items, code];
    },
    add(state, action) {
      const code = action.payload;
      if (!state.items.includes(code)) state.items.push(code);
    },
    remove(state, action) {
      const code = action.payload;
      state.items = state.items.filter((c) => c !== code);
    },
    clear(state) {
      state.items = [];
    },
  },
});

export const { toggle, add, remove, clear } = watchlistSlice.actions;
export default watchlistSlice.reducer;
