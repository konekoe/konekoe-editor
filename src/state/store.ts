import { configureStore } from "@reduxjs/toolkit";
import errorReducer from "./errorSlice";
import submissionsReducer from "./submissionsSlice";
import terminalsReducer from "./terminalSlice";

const store = configureStore({
    reducer: {
        error: errorReducer,
        submissions: submissionsReducer,
        terminals: terminalsReducer
    }
});

export type Store = typeof store;
export type RootState = ReturnType<typeof store.getState>;

export default store;