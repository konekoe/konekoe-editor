import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ErrorState, RuntimeError, MinorError, MessageError, CriticalError } from "../types";
import { assertNever, ErrorFactory } from "../utils/errors";

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
          state.criticalError = action.payload as CriticalError;
          break;
        
        case "MinorError": 
          state.minorErrors.push((action.payload as MinorError));
          break;
  
        case "MessageError":
          const messageError = action.payload as MessageError;

          if (messageError.title) {

            switch (messageError.title) {
              case "CriticalError":
                state.criticalError = ErrorFactory.critical(messageError.message);
                break;
              default:
                state.minorErrors.push(ErrorFactory.minor(messageError.message, messageError.title));
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

