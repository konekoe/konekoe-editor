import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ErrorState, RuntimeError } from "../types";
import { assertNever, CriticalError, MinorError, MessageError } from "../utils/errors";

const errorSlice = createSlice({
  name: "error",
  initialState: {
    criticalError: null,
    minorErrors: [],
    messageErrors: {}
  } as ErrorState,
  reducers: {
    push: (state, action: PayloadAction<RuntimeError>): void => {
      const name = action.payload.name as "CriticalError" | "MinorError" | "MessageError";
    
      switch (name) {
        case "CriticalError":
          state.criticalError = action.payload;
          break;
        
        case "MinorError": 
          state.minorErrors.push(action.payload as MinorError);
          break;
  
        case "MessageError":
          const messageError = action.payload as MessageError;

          if (messageError.title) {

            switch (messageError.title) {
              case "CriticalError":
                state.criticalError = new CriticalError(action.payload.message);
                break;
              default:
                state.minorErrors.push(new MinorError(action.payload.message, action.payload.title));
                break;
            }
          }

          state.messageErrors[messageError.id] = messageError;
          break;
    
        default:
          assertNever(name);
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

