import { configureStore } from "@reduxjs/toolkit";
import errorReducer from "./errorSlice";
import submissionsReducer from "./submissionsSlice";
import terminalsReducer from "./terminalSlice";
import exerciseReducer from "./exerciseSlice";

const store = configureStore({
    reducer: {
        error: errorReducer,
        submissions: submissionsReducer,
        terminals: terminalsReducer,
        exercises: exerciseReducer
    }
});

export type Store = typeof store;
export type RootState = ReturnType<typeof store.getState>;

export default store;