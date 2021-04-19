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
      const { exerciseId, data } = action.payload;
      
      state.output[exerciseId] = data;
    },
    clearTerminal: (state, action: PayloadAction<Omit<TerminalMessage, "data">>): void => {
      const { exerciseId } = action.payload;
      
      if (state.output[exerciseId]) {
        state.output[exerciseId] = "";
      }
    },
    addTerminalInput: (state, action: PayloadAction<TerminalMessage>): void => {
      const { exerciseId, data } = action.payload;
      
      if (state.input[exerciseId])
        state.input[exerciseId] = [data].concat(state.input[exerciseId] || []);
    },
    consumeTerminalInput: (state, action: PayloadAction<{ exerciseId: string }>): void => {
      const { exerciseId } = action.payload;
      if (state.input[exerciseId] && state.input[exerciseId])
        state.input[exerciseId].pop();
    },
  }
});

export const { addTerminalOutput, consumeTerminalInput, clearTerminal } = terminalsSlice.actions;

export default terminalsSlice.reducer;

