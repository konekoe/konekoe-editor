import { GenericError } from "../../types";

// Custom errors should be plain objects so that they can be serialized and stored in the Redux store.
function GenericError(msg: string): GenericError {
  return {
    name: "GenericError",
    message: msg || "An error occured."
  };
}

export default GenericError;