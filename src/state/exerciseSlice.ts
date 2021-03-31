import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { ExerciseState, Exercise, TabItem, SubmissionResponse } from "../types";

// All the state objects are maps of form <EXERCISE_ID> -> data
const exerciseSlice = createSlice({
  name: "exercises",
  initialState: {
    points: {},
    maxPoints: {},
    titles: {},
    descriptions: {}
  } as ExerciseState,
  reducers: {
    exerciseInit: (state, action: PayloadAction<Exercise[]>) => {
      const exercises = action.payload;
      
      exercises.map(ex => {
        state.titles[ex.id] = ex.title;
        state.points[ex.id] = ex.points;
        state.maxPoints[ex.id] = ex.maxPoints;
        state.descriptions[ex.id] = ex.description;
      });
    },
    updatePoints: (state, action: PayloadAction<SubmissionResponse>) => {
      const { exerciseId, points, maxPoints } = action.payload;

      if (state.points[exerciseId] && state.maxPoints[exerciseId]) {
        if (state.points[exerciseId] < points)
          state.points[exerciseId] = points;

        state.maxPoints[exerciseId] = maxPoints;
      }

    }
  }
});

export const exerciseTabSelector = (state: RootState): TabItem[] => {
  return Object.keys(state.exercises.titles).map(exerciseId => ({
    id: exerciseId,
    label: state.exercises.titles[exerciseId],
    points: {
      receivedPoints: state.exercises.points[exerciseId],
      maxPoints: state.exercises.maxPoints[exerciseId]
    }
  }));
};

export const { exerciseInit, updatePoints } = exerciseSlice.actions;

export default exerciseSlice.reducer;

