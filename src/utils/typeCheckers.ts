import { PointsProp, Exercise, ServerConnectResponse } from "../types";

const multiCheck = (searchValues: string[], typeCheckers: Array<(p: unknown) => boolean>, target: Record<string, unknown>): boolean => {
  return searchValues.reduce((acc: boolean, curr: string, index: number) => acc && typeCheckers[index](target[curr]), true);
}; 

const arrayReducer = (typeCheck: (p: unknown) => boolean) => (acc: boolean, curr: unknown) => acc && typeCheck(curr);

export const isString = (param: unknown): param is string => typeof param === "string" || param instanceof(String);

export const isArray = (param: unknown): param is [] => param instanceof Array;

export const isStringArray = (param: unknown): param is string[] => {
  if (!(isArray(param)))
    return false;

  return param.reduce(arrayReducer(isString), true);
};

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
}

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