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
      const { exerciseId, terminalId, data } = action.payload;
      
      if (state.output[exerciseId])
        state.output[exerciseId][terminalId] = (state.output[exerciseId][terminalId] || "") + data;
    },
    clearTerminal: (state, action: PayloadAction<Omit<TerminalMessage, "data">>): void => {
      const { exerciseId, terminalId } = action.payload;
      
      if (state.output[exerciseId]) {
        state.output[exerciseId][terminalId] = "";
      }
    },
    addTerminalInput: (state, action: PayloadAction<TerminalMessage>): void => {
      const { exerciseId, terminalId, data } = action.payload;
      
      if (state.input[exerciseId])
        state.input[exerciseId][terminalId] = [data].concat(state.input[exerciseId][terminalId] || []);
    },
    consumeTerminalInput: (state, action: PayloadAction<{ exerciseId: string, terminalId: string }>): void => {
      const { exerciseId, terminalId } = action.payload;
      if (state.input[exerciseId] && state.input[exerciseId][terminalId])
        state.input[exerciseId][terminalId].pop();
    },
  }
});

export const { addTerminalOutput, consumeTerminalInput, clearTerminal } = terminalsSlice.actions;

export default terminalsSlice.reducer;

