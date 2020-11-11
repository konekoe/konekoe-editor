// Custom errors should be plain objects so that they can be serialized and stored in the Redux store.
function GenericError(msg) {
  return {
    name: "Error",
    msg: msg || "An error occured."
  };
};

export default GenericError;