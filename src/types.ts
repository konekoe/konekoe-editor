import { Ace } from "ace-builds";
import { Store } from "./state/store";

export interface ErrorState {
  criticalError: CriticalError | null;
  minorErrors: MinorError[];
  messageErrors: ExerciseDictionary<MessageError>;
}

export type ExerciseDictionary<T> = { [exerciseId: string]: T };

export type TerminalOutputDictionary = ExerciseDictionary<string>;

export interface TerminalState {
  output: TerminalOutputDictionary;
  input: ExerciseDictionary<string[]>;
}

export interface SubmissionRequest {
  exerciseId: string;
  files: FileData[];
}


export interface SubmissionResponse {
  exerciseId: string;
  points: number;
  maxPoints: number;  // NOTE: The backend currently has two ways of defining max points: the database and the grader. Only one should be used so that max points don't need to be received here.
}

export interface ExerciseSubmission {
  id: string;
  date: Date;
  points: number;
  files: FileData[];
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
  allSubmissions: ExerciseDictionary<string[]>;               // Exercise ID to array of submission ids.
  activeSubmissions: ExerciseDictionary<ExerciseFileDict>;    // The files being edited
  submissionRequests: ExerciseDictionary<FileData[] | undefined>;  // Submissions made by the user that are being processed.
  submissionFetchRequests: ExerciseDictionary<string | undefined>         // Requests for fetching an older submission.
}

export interface ExerciseState {
  points: ExerciseDictionary<number>;          // The most points received from a submission per exercise.
  maxPoints: ExerciseDictionary<number>;       // The maximum points that can be received for each exercise.
  titles: ExerciseDictionary<string>;         // Exercise titles  
  descriptions: ExerciseDictionary<string>;   // Exercise markdown descriptions
}

export interface TerminalMessage {
  exerciseId: string;
  data: string;
}

export interface InfoBoxProps {
  content: string;
}

export interface CodeTerminalProps {
  exerciseId: string;
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
  selectionResettingOn?: boolean;
}

export interface ErrorDialogProps {
  error?: MinorError;
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

export type RuntimeError = MessageError | CriticalError | MinorError;

export interface TestingWindow extends Window {
  Cypress: boolean;
  store: Store;
}

export type GlobalWindow = TestingWindow & typeof globalThis;

export interface ServerConnectRequest {
  token: string;
}

export interface ServerConnectResponse {
  exercises: Exercise[];
}

export interface SubmissionFetchRequest {
  exerciseId: string;
  submissionId: string;
}

export type SubmissionFetchResponse = SubmissionFetchRequest & Omit<ExerciseSubmission, "id">; 

export type RequestPayload = ServerConnectRequest | SubmissionRequest | SubmissionFetchRequest;

export interface RequestMessage {
  type: "server_connect" | "code_submission" | "submission_fetch";
  payload: RequestPayload;
}

export type ResponsePayload = ServerConnectResponse | SubmissionResponse | SubmissionFetchResponse | TerminalMessage;

export interface ResponseMessage {
  type: "server_connect" | "code_submission" | "submission_fetch" | "terminal_output";
  payload: ResponsePayload;
  error?: MessageError;
}

interface GenericError {
  name: string;
  message: string;
}

export interface CriticalError extends GenericError {
  name: "CriticalError";
}

export interface MinorError extends GenericError {
  name: "MinorError";
  title: string;
}

export interface MessageError extends GenericError {
  name: "MessageError";
  title?: string;
  id: string;
}