import GenericError from "./GenericError.js";
import { MinorError } from "../../types.js";

function MinorError(msg: string, title: string): MinorError {
    return {
        ...(GenericError(msg)),
        name: "MinorError",
        title: title || "MinorError"
    };
}

export default MinorError;