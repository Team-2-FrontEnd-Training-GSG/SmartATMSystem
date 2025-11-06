import { configureStore } from "@reduxjs/toolkit";
import watchlistReducer from "./watchlist/watchlistSlice.js";

const store = configureStore({
  reducer: {
    watchlist: watchlistReducer,
  },
});

export default store;
