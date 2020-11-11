import GenericError from "./GenericError.js";

function MessageError(msg) {
    Object.assign(this, new GenericError(msg));
    this.name = "MessageError";
};

export default MessageError;