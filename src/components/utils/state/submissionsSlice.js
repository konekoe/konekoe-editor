import { createSlice, createSelector } from "@reduxjs/toolkit";
import watch from "redux-watch";

// All the state objects are maps of form <EXERCISE_ID> -> data
const submissionsSlice = createSlice({
  name: "submissions",
  initialState: {
    submissions: {},        // Ids for all submissions for all exercises.
    activeSubmissions: {},  // Submissions that are being processed. One per exercise.
    points: {},             // Received points per exercise.
    maxPoints: {}           // Max points per exercise.
  },
  reducers: {
    init: (state, action) => {
      const exercises = action.payload;

      exercises.map(ex => {
        state.points[ex.id] = ex.points;
        state.maxPoints[ex.id] = ex.maxPoints;
        state.submissions[ex.id] = ex.submissions;
      });
    },
    submit: (state, action) => {
      const { id, files } = action.payload;
      state.activeSubmissions[id] = files;
    },
    resolveSubmission: (state, action) => {
      console.log(action.payload);

      state.activeSubmissions[action.payload.id] = null;


      // Submission might result in an error. This part of the store is not interested in errors.
      const { result } = action.payload

      if (result) {
        state.points[id] = Math.max(state.points[id], result.points);
        state.maxPoints[id] = result.maxPoints; // TODO: This line could be removed if we assumed that max points are received correctly on store init.
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

export const maxPointsSelectorFactory = id => createSelector(
  maxPointsSelector,
  maxPointsMap => maxPointsMap[id]
);

// Watchers are registered are passed a store object by components which use them.
export const submissionWatcherFactory = (store, field) => watch(store.getState, `submissions.${ field }`);


export const { submit, resolveSubmission, init } = submissionsSlice.actions

export default submissionsSlice.reducer;

