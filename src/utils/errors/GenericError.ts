// Custom errors should be plain objects so that they can be serialized and stored in the Redux store.
class GenericError {
  name = "GenericError";
  message: string;

  constructor(msg: string) {
    this.message = msg;
  }
}

export default GenericError;