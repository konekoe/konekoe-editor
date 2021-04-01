import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SubmissionState, Exercise, SubmissionRequest, SubmissionResponse, ExerciseFile, ExerciseFileDict, SubmissionFetchRequest } from "../types";
import watch from "redux-watch";
import { Store } from "./store";
import { MinorError } from "../utils/errors";

// All the state objects are maps of form <EXERCISE_ID> -> data
const submissionsSlice = createSlice({
  name: "submissions",
  initialState: {
    allSubmissions: {},
    submissionRequests: {},
    activeSubmissions: {},
    submissionFetchRequests: {}
  } as SubmissionState,
  reducers: {
    submissionInit: (state, action: PayloadAction<Exercise[]>) => {
      const exercises = action.payload;
      
      exercises.map(ex => {
        state.allSubmissions[ex.id] = ex.submissions;
        state.submissionRequests[ex.id] = undefined;
      });
    },
    submit: (state, action: PayloadAction<SubmissionRequest>) => {
      const { exerciseId, files } = action.payload;
      
      // Only one active submission is allowed 
      if (state.submissionRequests[exerciseId])
        throw new MinorError("A submission is already being processed.", "Please wait");

      state.submissionRequests[exerciseId] = files;
    },
    setActiveSubmission: (state, action: PayloadAction<{ exerciseId: string, data: ExerciseFile[] }>) => {
      state.activeSubmissions[action.payload.exerciseId] = action
      .payload
      .data
      .reduce((dict: ExerciseFileDict, curr: ExerciseFile) => {
        dict[curr.fileId] = curr;
        return dict;
      }, {} as ExerciseFileDict);

      state.submissionFetchRequests[action.payload.exerciseId] = undefined;
    },
    resolveSubmission: (state, action: PayloadAction<SubmissionResponse>) => {
      const { exerciseId } = action.payload;

      state.submissionRequests[exerciseId] = undefined;
    },
    fetchSubmission: (state, action: PayloadAction<SubmissionFetchRequest>) => {
      const { exerciseId, submissionId } = action.payload;
      // Only one active submission is allowed 
      if (state.submissionFetchRequests[exerciseId])
        throw new MinorError("A submission is already being fetched.", "Please wait");

      state.submissionFetchRequests[exerciseId] = submissionId;
    }
  }
});

// Watchers are registered are passed a store object by components which use them.
export const submissionWatcherFactory = (store: Store, field: string) => watch(store.getState, `submissions.${ field }`);

export const { submit, resolveSubmission, submissionInit, setActiveSubmission, fetchSubmission } = submissionsSlice.actions;

export default submissionsSlice.reducer;

