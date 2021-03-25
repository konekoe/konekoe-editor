import { Ace } from "ace-builds";
import { Store } from "./state/store";

export interface ErrorState {
  criticalError: CriticalError | null;
  minorErrors: MinorError[];
  messageErrors: ExerciseDictionary<MessageError>;
}

export type ExerciseDictionary<T> = { [exerciseId: string]: T };

export type TerminalOutputDictionary = ExerciseDictionary<{ [terminalId: string]: string }>;

export interface TerminalState {
  output: TerminalOutputDictionary;
  input: ExerciseDictionary<{ [terminalId: string]: string[] }>;
}

export interface SubmissionRequest {
  exerciseId: string;
  files: { [filename: string]: FileData };
}

export interface SubmissionResponse {
  exerciseId: string;
  points: number;
  maxPoints: number;  // NOTE: The backend currently has two ways of defining max points: the database and the grader. Only one should be used so that max points don't need to be received here.
  error?: MessageError;
}

export interface Exercise {
  id: string;
  points: number;
  maxPoints: number;
  submissions: string[]; // Array of submission ids.
  title: string;
  description: string;
}

export interface FileData {
  filename: string;
  data: string;
}

export interface ExerciseFile extends FileData {
  fileId: string;
}

export type ExerciseFileDict = { [fileId: string]: ExerciseFile };

export type FileDataDict = { [fileId: string]: FileData };

export interface SubmissionState {
  allSubmissions: ExerciseDictionary<string[]>;                              // Exercise ID to array of submission ids.
  activeSubmissions: ExerciseDictionary<ExerciseFileDict>;
  submissionRequests: ExerciseDictionary<FileDataDict | null>;  // Submissions made by the user that are being processed.
}

export interface ExerciseState {
  points: ExerciseDictionary<number>;          // The most points received from a submission per exercise.
  maxPoints: ExerciseDictionary<number>;       // The maximum points that can be received for each exercise.
  titles: ExerciseDictionary<string>;         // Exercise titles  
  descriptions: ExerciseDictionary<string>;   // Exercise markdown descriptions
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
  exerciseId: string;
  terminalId?: string;
  allowInput?: boolean;
}

export interface PointsProp {
  receivedPoints: number;
  maxPoints: number;
}

export interface TabProps {
  label: string;
  id: string;
  clickHandler: () => void;
  points?: PointsProp;
}

export type TabItem = Omit<TabProps, "clickHandler">;

export interface TabBarProps {
  tabItems: TabItem[];
  selectionHandler: (id: string) => void;
}

export interface ErrorDialogProps {
  title: string;
  message: string;
  open: boolean;
  numOfRemainingErrors?: number;
  closeHandler: () => void;
}

export interface ConditionalBadgeProps { 
  badgeContent?: number;
  color?: "primary" | "secondary" | "error"; 
}

export interface CodeEditorProps {
  exerciseId: string;
}

export type EditSessionDict = { [fileId: string]: FileEditSession };

export interface FileEditSession extends Ace.EditSession {
  filename: string;
  fileId: string;
}

export interface GenericError {
  name: string;
  message: string;
}

// Critical error is a sign of a unrecoverable state of execution. It's equivalent to a crash. Critical errors should never happen.
export interface CriticalError extends GenericError {
  name: "CriticalError";
}

// Message errors occur in the messaging interface.
// Message errors can contain a type if another type error should be interpreted from them.
// id can be exerciseId or fileId.
export interface MessageError extends GenericError {
  name: "MessageError";
  id: string;
  title?: string;
}

// Minor errors are note worthy but won't cause a crash. For instance, an error produced by the backend grader.
export interface MinorError extends GenericError {
  name: "MinorError";
  title: string;
}

export type RuntimeError = CriticalError | MinorError | MessageError;

export interface TestingWindow extends Window {
  Cypress: boolean;
  store: Store;
}

export type GlobalWindow = TestingWindow & typeof globalThis;