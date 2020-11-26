import { createSlice, createSelector } from "@reduxjs/toolkit";
import watch from "redux-watch";

// All the state objects are maps of form <EXERCISE_ID> -> data
const terminalsSlice = createSlice({
  name: "terminals",
  initialState: {
    output: {},            // Data received from server.
    input: {}              // Data to be sent to server.
  },
  reducers: {
    addTerminalOutput: (state, action) => {
      const { id, data } = action.payload;
      state.output[id] = [data].concat(state.output[id] || []);
    },
    consumeTerminalOutput: (state, action) => {
      const { id } = action.payload;
      state.output[id].pop();
    },
  }
});

// Watchers are registered are passed a store object by components which use them.
export const outputWatcherFactory = (store) => watch(store.getState, "terminals.output");


export const { addTerminalOutput, consumeTerminalOutput } = terminalsSlice.actions

export default terminalsSlice.reducer;

