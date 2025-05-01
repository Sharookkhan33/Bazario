// store.js
import { configureStore, createSlice } from '@reduxjs/toolkit';

// Properly create a slice
const counterSlice = createSlice({
  name: 'counter',
  initialState: { count: 0 },
  reducers: {
    increment: (state) => {
      state.count += 1;
    },
    decrement: (state) => {
      state.count -= 1;
    },
  },
});

// Create store using configureStore
const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
  },
});

// Export actions if you need them
export const { increment, decrement } = counterSlice.actions;

export default store;
