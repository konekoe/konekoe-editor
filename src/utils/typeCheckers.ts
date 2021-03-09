import { PointsProp } from "../types";

export const isString = (param: unknown): param is string => typeof param === "string" || param instanceof(String);

export const isNumber = (param: unknown): param is number => !isNaN(Number(param));

export const isPointsProp = (param: unknown): param is PointsProp => {
  if (typeof param !== "object" || param === null)
    return false;
  
  const multiInclude = (searchValues: string[], target: string[]): boolean => searchValues.reduce((acc: boolean, curr: string) => acc && target.includes(curr), true); 
  
  return multiInclude(["receivedPoints", "maxPoints"], Object.keys(param))
    && Object.values(param).reduce((acc: boolean, curr: unknown) => acc && isNumber(curr), true);
};