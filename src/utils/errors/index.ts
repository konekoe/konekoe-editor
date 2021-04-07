export { default as ErrorFactory } from "./ErrorFactory";

export const assertNever = (value: never): never => {
  throw Error(`Unhandled discriminated union member: ${ JSON.stringify(value) }`);
};