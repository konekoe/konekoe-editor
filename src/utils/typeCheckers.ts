import { PointsProp, Exercise, ServerConnectResponse, SubmissionResponse, TerminalMessage, SubmissionFetchResponse, FileData, ResponseMessage, MessageError } from "../types";

type TypeChecker = (p: unknown) => boolean;

// -------------- Helpers -------------------

const multiCheck = (searchValues: string[], typeCheckers: Array<TypeChecker>, target: Record<string, unknown>): boolean => {
  return searchValues.reduce((acc: boolean, curr: string, index: number) => acc && typeCheckers[index](target[curr]), true);
}; 

const arrayReducer = (typeCheck: TypeChecker) => (acc: boolean, curr: unknown) => acc && typeCheck(curr);

// Commented out to please the linter.
const or = (f1 = isUndefined, f2 = isUndefined): TypeChecker => (p: unknown) => f1(p) || f2(p);

const includedIn = (arr: string[]): TypeChecker => (p: unknown) => isString(p) && arr.includes(p);


//------------------ Exports -----------------


export const isUndefined: TypeChecker = (param: unknown): param is undefined => typeof param === undefined;

export const isString = (param: unknown): param is string => typeof param === "string" || param instanceof(String);

export const isArray = (param: unknown): param is [] => param instanceof Array;

export const isStringArray = (param: unknown): param is string[] => {
  if (!(isArray(param)))
    return false;

  return param.reduce(arrayReducer(isString), true);
};

export const isDate = (param: unknown): param is Date =>  isString(param) && Boolean(Date.parse(param));

export const isNumber = (param: unknown): param is number => !isNaN(Number(param));

export const isStringRecord = (param: unknown): param is Record<string, unknown> => {
  if (typeof param !== "object" || param === null)
    return false;

  return isStringArray(Object.keys(param));
};

export const isExercise = (param: unknown): param is Exercise => {
  if (!isStringRecord(param))
    return false;

  return multiCheck(
    ["id", "points", "maxPoints", "submissions", "title", "description"],
    [isString,isNumber,isNumber,isStringArray,isString,isString],
    param
    );
};

export const isExerciseArray = (param: unknown): param is Exercise[] => {
  if (!isArray(param))
    return false;

  return param.reduce(arrayReducer(isExercise), true);
};

export const isFileData = (param: unknown): param is FileData => {
  if (!isStringRecord(param))
    return false;

  return multiCheck(["filename", "data"], [isString, isString], param);
};

export const isFileDataArray = (param: unknown): param is FileData[] => isArray(param) && param.reduce(arrayReducer(isFileData), true);

export const isPointsProp = (param: unknown): param is PointsProp => {
  if (!isStringRecord(param))
    return false;

  return multiCheck(["receivedPoints", "maxPoints"], [isNumber, isNumber], param);
};

export const isServerConnectResponse = (param: unknown): param is ServerConnectResponse => {
  if (!isStringRecord(param))
    return false;

  return multiCheck(["exercises"], [isExerciseArray], param);
};

export const isMessageError = (param: unknown): param is MessageError => {
  if (!isStringRecord(param))
    return false;

  return multiCheck(["message","id", "title"], [isString, isString, or(isString, isUndefined)], param);
};

export const isSubmissionResponse = (param: unknown): param is SubmissionResponse => {
  if (!isStringRecord(param))
    return false;

  return multiCheck(["exerciseId","points", "maxPoints"], [isString, isNumber, isNumber], param);
};

export const isTerminalMessage = (param: unknown): param is TerminalMessage => {
  if (!isStringRecord(param))
    return false;

  return multiCheck(["exerciseId", "data"], [isString, isString], param);
};

export const isSubmissionFetchResponse = (param: unknown): param is SubmissionFetchResponse => {
  if (!isStringRecord(param))
    return false;

  return multiCheck(
    ["exerciseId","submissionId", "date", "points", "files"],
    [isString, isString, isDate, isNumber, isFileDataArray],
    param);
};

// NOTE: Does not check that type field and payload correspond.
// Technically the type itself does not define links between the type field and payload type.

export const isResponseMessage = (param: unknown): param is ResponseMessage => {
  if (!isStringRecord(param))
    return false;

  return multiCheck(
    ["type"],
    [
      includedIn(["server_connect", "code_submission", "submission_fetch", "terminal_output"])
    ],
    param);
};