import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { ExerciseState, Exercise, TabItem } from "../types";

// All the state objects are maps of form <EXERCISE_ID> -> data
const exerciseSlice = createSlice({
  name: "exercises",
  initialState: {
    points: {
      "some-exercise": 1
    },
    maxPoints: {
      "some-exercise": 10
    },
    titles: {
      "some-exercise": "Test exercise"
    },
    descriptions: {
      "some-exercise": "# Test this version of the editor\nIs it working?"
    }
  } as ExerciseState,
  reducers: {
    init: (state, action: PayloadAction<Exercise[]>) => {
      const exercises = action.payload;
      
      exercises.map(ex => {
        state.titles[ex.id] = ex.title;
        state.points[ex.id] = ex.points;
        state.maxPoints[ex.id] = ex.maxPoints;
        state.descriptions[ex.id] = ex.description;
      });
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

export const {  } = exerciseSlice.actions;

export default exerciseSlice.reducer;

