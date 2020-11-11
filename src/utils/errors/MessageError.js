import GenericError from "./GenericError.js";

function MessageError(msg) {
    return {
        ...(new GenericError(msg)),
        name: "MessageError"
    };
};

export default MessageError;