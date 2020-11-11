import GenericError from "./GenericError.js";

function CriticalError(msg) {
    Object.assign(this, new GenericError(msg));
    this.name = "CriticalError";
};

export default CriticalError;