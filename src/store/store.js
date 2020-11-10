import { configureStore } from "@reduxjs/toolkit";
import errorReducer from "../components/utils/state/errorSlice.js";

export default configureStore({
  reducer: {
    error: errorReducer
  }
});