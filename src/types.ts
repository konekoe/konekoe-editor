export interface ErrorState {
  queue: Error[]
}

export type ExerciseDictionary<T> = { [exerciseId: string]: T };

export interface TerminalState {
  output: ExerciseDictionary<{ [terminalId: string]: string }>;
  input: ExerciseDictionary<{ [terminalId: string]: string[] }>;
}

export interface SubmissionRequest {
  exerciseId: string;
  files: { [filename: string]: string };
}

export interface SubmissionResponse {
  exerciseId: string;
  points: number;
  maxPoints: number;  // NOTE: The backend currently has two ways of defining max points: the database and the grader. Only one should be used so that max points don't need to be received here.
  error?: Error;
}

export interface Exercise {
  id: string;
  points: number;
  maxPoints: number;
  submissions: string[]; // Array of submission ids.
}

export interface SubmissionState {
  submissions: ExerciseDictionary<string[]>;                              // Exercise ID to array of submission ids.
  activeSubmissions: ExerciseDictionary<{ [filename: string]: string }>;  // Submissions made by the user that are being processed.
  points: ExerciseDictionary<number>;                                     // The most points received from a submission per exercise.
  maxPoints: ExerciseDictionary<number>;                                  // The maximum points that can be received for each exercise.
}

export interface TerminalMessage {
  exerciseId: string;
  terminalId: string;
  data: string;
}

export interface InfoBoxProps {
  content: string;
}

export interface CodeTerminalProps {
  terminalId: string;
  allowInput: boolean;
}