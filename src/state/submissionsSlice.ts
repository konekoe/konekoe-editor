import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SubmissionState, Exercise, SubmissionRequest, SubmissionResponse } from "../types";


// All the state objects are maps of form <EXERCISE_ID> -> data
const submissionsSlice = createSlice({
  name: "submissions",
  initialState: {
    submissions: {},        // Ids for all submissions for all exercises.
    activeSubmissions: {},  // Submissions that are being processed. One per exercise.
    points: {},             // Received points per exercise.
    maxPoints: {}           // Max points per exercise.
  } as SubmissionState,
  reducers: {
    submissionInit: (state, action: PayloadAction<Exercise[]>) => {
      const exercises = action.payload;
      
      exercises.map(ex => {
        state.points[ex.id] = ex.points;
        state.maxPoints[ex.id] = ex.maxPoints;
        state.submissions[ex.id] = ex.submissions;
      });
    },
    submit: (state, action: PayloadAction<SubmissionRequest>) => {
      const { exerciseId, files } = action.payload;
      state.activeSubmissions[exerciseId] = files;
    },
    resolveSubmission: (state, action: PayloadAction<SubmissionResponse>) => {
      const { exerciseId } = action.payload;

      state.activeSubmissions[exerciseId] = null;

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

/*
const activeSubmissionsSelector = (store: Store) => store.getState().submissions.activeSubmissions;

// Generates functions for fetching the current active submission for an exercise.
export const activeSubmissionSelectorFactory = (id: string) => createSelector(
  activeSubmissionsSelector,
  submissions => submissions[id]
);

const maxPointsSelector = (store: Store) => store.getState().submissions.maxPoints;
const pointsSelector = (store: Store) => store.getState().submissions.points;

export const pointsSelectorFactory = (id: string) => createSelector(
  maxPointsSelector,
  pointsSelector,
  (maxPointsMap, pointsMap) => ({ maxPoints: maxPointsMap[id], points: pointsMap[id] })
);

// Watchers are registered are passed a store object by components which use them.
export const submissionWatcherFactory = (store: Store, field: string) => watch(store.getState, `submissions.${ field }`);

*/

export const { submit, resolveSubmission, submissionInit } = submissionsSlice.actions;

export default submissionsSlice.reducer;

