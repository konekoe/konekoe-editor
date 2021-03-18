import GenericError from "./GenericError";
import { MinorError } from "../../types";

function MinorError(msg: string, title: string): MinorError {
    return {
        ...(GenericError(msg)),
        name: "MinorError",
        title: title || "MinorError"
    };
}

export default MinorError;