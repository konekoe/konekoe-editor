import { PointsProp, Exercise } from "../types";

const multiCheck = (searchValues: string[], typeCheckers: Array<(p: unknown) => boolean>, target: Record<string, unknown>): boolean => {
  return searchValues.reduce((acc: boolean, curr: string, index: number) => acc && typeCheckers[index](target[curr]), true);
}; 

export const isString = (param: unknown): param is string => typeof param === "string" || param instanceof(String);

export const isStringArray = (param: unknown): param is string[] => {
  if (!(param instanceof Array))
    return false;

  return param.reduce((acc: boolean, curr: unknown) => acc && isString(curr), true);
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

export const isPointsProp = (param: unknown): param is PointsProp => {
  if (!isStringRecord(param))
    return false;
    
  return multiCheck(["receivedPoints", "maxPoints"], [isNumber, isNumber], param);
};