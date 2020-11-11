import GenericError from "./GenericError.js";

function CriticalError(msg) {
    return {
        ...(new GenericError(msg)),
        name: "CriticalError"
    };
};

export default CriticalError;