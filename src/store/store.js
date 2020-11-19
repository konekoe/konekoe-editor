import { configureStore } from "@reduxjs/toolkit";
import errorReducer from "../components/utils/state/errorSlice.js";
import submissionsReducer from "../components/utils/state/submissionsSlice.js";
import terminalsReducer from "../components/utils/state/terminalSlice.js";

export default configureStore({
  reducer: {
    error: errorReducer,
    submissions: submissionsReducer,
    terminals: terminalsReducer
  }
});