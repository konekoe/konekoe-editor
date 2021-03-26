import GenericError from "./GenericError";

class CriticalError extends GenericError {
    name = "CriticalError";

    constructor(msg: string) {
      super(msg);
    }
}

export default CriticalError;