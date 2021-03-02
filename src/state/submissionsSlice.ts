import { createSlice, createSelector } from "@reduxjs/toolkit";
import watch from "redux-watch";

// All the state objects are maps of form <EXERCISE_ID> -> data
const submissionsSlice = createSlice({
  name: "submissions",
  initialState: {
    submissions: {},        // Ids for all submissions for all exercises.
    activeSubmissions: {},  // Submissions that are being processed. One per exercise.
    fetchedSubmissions: {}, // Submissions can be fetched for editing.
    points: {},             // Received points per exercise.
    maxPoints: {}           // Max points per exercise.
  },
  reducers: {
    submissionInit: (state, action) => {
      const exercises = action.payload;
      
      exercises.map(ex => {
        state.points[ex.id] = parseInt(ex.points);
        state.maxPoints[ex.id] = parseInt(ex.maxPoints);
        state.submissions[ex.id] = ex.submissions;
      });
    },
    submit: (state, action) => {
      const { id, files } = action.payload;
      state.activeSubmissions[id] = files;
    },
    resolveSubmission: (state, action) => {
      const id = action.payload.id;

      state.activeSubmissions[id] = null;

      // Submission might result in an error. This part of the store is not interested in errors.
      const { error } = action.payload

      if (!error) {
        const result = action.payload;

        state.points[id] = Math.max(state.points[id], parseInt(result.points));
        state.maxPoints[id] = parseInt(result.max_points); // TODO: This line could be removed if we assumed that max points are received correctly on store init.
      }
    }
  }
});

const activeSubmissionsSelector = state => state.getState().submissions.activeSubmissions;

// Generates functions for fetching the current active submission for an exercise.
export const activeSubmissionSelectorFactory = id => createSelector(
  activeSubmissionsSelector,
  submissions => submissions[id]
);

const maxPointsSelector = state => state.getState().submissions.maxPoints;
const pointsSelector = state => state.getState().submissions.points;

export const pointsSelectorFactory = (id) => createSelector(
  maxPointsSelector,
  pointsSelector,
  (maxPointsMap, pointsMap) => ({ maxPoints: maxPointsMap[id], points: pointsMap[id] })
);

// Watchers are registered are passed a store object by components which use them.
export const submissionWatcherFactory = (store, field) => watch(store.getState, `submissions.${ field }`);


export const { submit, resolveSubmission, submissionInit } = submissionsSlice.actions

export default submissionsSlice.reducer;

