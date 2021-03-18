import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SubmissionState, Exercise, SubmissionRequest, SubmissionResponse } from "../types";


// All the state objects are maps of form <EXERCISE_ID> -> data
const submissionsSlice = createSlice({
  name: "submissions",
  initialState: {
    allSubmissions: {},
    submissionRequests: {},
    activeSubmissions: {
      "some-exercise": {
        "file1": {
          fileId: "file1",
          filename: "main.js",
          data: "import { testData } from './functions.js'"
        },
        "file2": {
          fileId: "file2",
          filename: "functions.js",
          data: `export function(data) {
            // test the data
          }`
        },
      },
      "some-exercise1": {
        "file1": {
          fileId: "file1",
          filename: "index.ts",
          data: `
          import { testData } from './functions'
          import { Data } from './types'

          const someData: Data[] = [
            {
              id: "123",
              value: -1
            },
            {
              id: "321",
              value: 1
            },
          ]
          `
        },
        "file2": {
          fileId: "file2",
          filename: "functions.ts",
          data: `export function(data: Data[]): boolean {
            // test the data
          }`
        },
        "file3": {
          fileId: "file3",
          filename: "types.ts",
          data: `export interface Data {
            id: string;
            value: number;
          }
          }`
        },
      }
    },
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
    resolveSubmission: (state, action: PayloadAction<SubmissionResponse>) => {
      const { exerciseId } = action.payload;

      state.submissionRequests[exerciseId] = null;
    }
  }
});


export const { submit, resolveSubmission, submissionInit } = submissionsSlice.actions;

export default submissionsSlice.reducer;

