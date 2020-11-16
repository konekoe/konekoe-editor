import { configureStore } from "@reduxjs/toolkit";
import errorReducer from "../components/utils/state/errorSlice.js";
import submissionsReducer from "../components/utils/state/submissionsSlice.js";

export default configureStore({
  reducer: {
    error: errorReducer,
    submissions: submissionsReducer
  }
});