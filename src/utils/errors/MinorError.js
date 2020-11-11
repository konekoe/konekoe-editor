import GenericError from "./GenericError.js";

function MinorError(msg, title) {
    return {
        ...(new GenericError(msg)),
        name: "MinorError",
        title: title || "MinorError"
    };
};

export default MinorError;