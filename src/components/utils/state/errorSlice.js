import { createSlice, createSelector } from "@reduxjs/toolkit";

const errorSlice = createSlice({
  name: "error",
  initialState: {
    queue: []
  },
  reducers: {
    push: (state, action) => {
      state.queue = [action.payload].concat(state.queue);
    },
    pop: state => {
      state.queue.pop()
    }
  }
});


const errorQueueSelector = state => state.getState().error.queue;

// NOTE: In javascript, an out of bounds index results in "undefined" being returned.
export const topErrorSelector = createSelector(
  errorQueueSelector,
  queue => queue
);

export const { push, pop } = errorSlice.actions

export default errorSlice.reducer;

