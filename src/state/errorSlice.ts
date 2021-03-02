import { createSlice, createSelector, PayloadAction } from "@reduxjs/toolkit";
import { ErrorState } from "../types";
import { Store } from "./store";

const errorSlice = createSlice({
  name: "error",
  initialState: {
    queue: []
  } as ErrorState,
  reducers: {
    push: (state, action: PayloadAction<Error>): void => {
      state.queue = [action.payload].concat(state.queue);
    },
    pop: (state: ErrorState): void => {
      state.queue.pop();
    }
  }
});


const errorQueueSelector = (store: Store): Error[] => store.getState().error.queue;

// NOTE: In javascript, an out of bounds index results in "undefined" being returned.
export const topErrorSelector = createSelector(
  errorQueueSelector,
  queue => queue
);

export const { push, pop } = errorSlice.actions;

export default errorSlice.reducer;

