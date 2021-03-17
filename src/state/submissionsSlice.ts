import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SubmissionState, Exercise, SubmissionRequest, SubmissionResponse, TabItem } from "../types";
import { RootState } from "./store";

// All the state objects are maps of form <EXERCISE_ID> -> data
const submissionsSlice = createSlice({
  name: "submissions",
  initialState: {
    allSubmissions: {},
    submissionRequests: {},
    activeSubmissions: {},
    points: {},
    maxPoints: {},
    titles: {}
  } as SubmissionState,
  reducers: {
    submissionInit: (state, action: PayloadAction<Exercise[]>) => {
      const exercises = action.payload;
      
      exercises.map(ex => {
        state.titles[ex.id] = ex.title;
        state.points[ex.id] = ex.points;
        state.maxPoints[ex.id] = ex.maxPoints;
        state.allSubmissions[ex.id] = ex.submissions;
        state.submissionRequests[ex.id] = null;
      });
    },
    submit: (state, action: PayloadAction<SubmissionRequest>) => {
      const { exerciseId, files } = action.payload;
      
      // Only one active submission is allowed 
      if (state.submissionRequests[exerciseId])
        throw Error("A submission is already being processed.");

      state.submissionRequests[exerciseId] = files;
    },
    resolveSubmission: (state, action: PayloadAction<SubmissionResponse>) => {
      const { exerciseId } = action.payload;

      state.submissionRequests[exerciseId] = null;

      // Submission might result in an error. This part of the store is not interested in errors.
      const { error } = action.payload;

      if (!error) {
        const result = action.payload;

        state.points[exerciseId] = Math.max(state.points[exerciseId], result.points);
        state.maxPoints[exerciseId] = result.maxPoints; // TODO: This line could be removed if we assumed that max points are received correctly on store init.
      }
    }
  }
});

export const exerciseTabSelector = (state: RootState): TabItem[] => {
  return Object.keys(state.submissions.titles).map(exerciseId => ({
    id: exerciseId,
    label: state.submissions.titles[exerciseId],
    points: {
      receivedPoints: state.submissions.points[exerciseId],
      maxPoints: state.submissions.maxPoints[exerciseId]
    }
  }));
};

export const { submit, resolveSubmission, submissionInit } = submissionsSlice.actions;

export default submissionsSlice.reducer;

