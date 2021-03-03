import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TerminalState, TerminalMessage } from "../types";

// All the state objects are maps of form <EXERCISE_ID> -> data
const terminalsSlice = createSlice({
  name: "terminals",
  initialState: {
    output: {},            // Data received from server.
    input: {}              // Data to be sent to server.
  } as TerminalState,
  reducers: {
    addTerminalOutput: (state, action: PayloadAction<TerminalMessage>): void => {
      const { id, data } = action.payload;
      
      state.output[id] = [data].concat(state.output[id] || []);
    },
    consumeTerminalOutput: (state, action: PayloadAction<{ id: string }>): void => {
      const { id } = action.payload;
      if (state.output[id])
        state.output[id].pop();
    },
  }
});

export const { addTerminalOutput, consumeTerminalOutput } = terminalsSlice.actions;

export default terminalsSlice.reducer;

