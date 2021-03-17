export { default as CriticalError } from "./CriticalError";
export { default as MinorError } from "./MinorError";
export { default as MessageError } from "./MessageError";
export { default as GenericError } from "./GenericError";

export const assertNever = (value: never): never => {
  throw Error(`Unhandled discriminated union member: ${ JSON.stringify(value) }`);
};