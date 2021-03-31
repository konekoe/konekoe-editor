import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SubmissionState, Exercise, SubmissionRequest, SubmissionResponse, ExerciseFile, ExerciseFileDict } from "../types";


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

      state.submissionRequests[exerciseId] = null;
    }
  }
});


export const { submit, resolveSubmission, submissionInit, setActiveSubmission } = submissionsSlice.actions;

export default submissionsSlice.reducer;

