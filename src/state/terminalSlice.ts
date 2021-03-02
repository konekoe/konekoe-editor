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
      state.output.set(id, [data].concat(state.output.get(id) || []));
    },
    consumeTerminalOutput: (state, action: PayloadAction<{ id: string }>): void => {
      const { id } = action.payload;
      state.output.get(id).pop();
    },
  }
});

export const { addTerminalOutput, consumeTerminalOutput } = terminalsSlice.actions;

export default terminalsSlice.reducer;

