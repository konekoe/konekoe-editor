import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ErrorState, RuntimeError } from "../types";
import { assertNever, CriticalError, MinorError } from "../utils/errors";

const errorSlice = createSlice({
  name: "error",
  initialState: {
    criticalError: null,
    minorErrors: [],
    messageErrors: {}
  } as ErrorState,
  reducers: {
    push: (state, action: PayloadAction<RuntimeError>): void => {
      switch (action.payload.name) {
        case "CriticalError":
          state.criticalError = action.payload;
          break;
        
        case "MinorError": 
          state.minorErrors.push(action.payload);
          break;
  
        case "MessageError":
          if (action.payload.title) {

            switch (action.payload.title) {
              case "CriticalError":
                state.criticalError = CriticalError(action.payload.message);
                break;
              default:
                state.minorErrors.push(MinorError(action.payload.message, action.payload.title));
                break;
            }
          }

          state.messageErrors[action.payload.id] = action.payload;
          break;
    
        default:
          assertNever(action.payload);
      }
    },
    popMinorError: (state: ErrorState): void => {
      state.minorErrors.pop();
    },
    clearMessageError: (state: ErrorState, action: PayloadAction<string>): void => {
      if (state.messageErrors[action.payload])
        delete state.messageErrors[action.payload];
    }
  }
});


export const { push, popMinorError, clearMessageError } = errorSlice.actions;

export default errorSlice.reducer;

