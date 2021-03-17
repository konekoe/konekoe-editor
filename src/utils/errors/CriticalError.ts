import GenericError from "./GenericError";
import { CriticalError } from "../../types";

function CriticalError(msg: string): CriticalError {
    return {
        ...(GenericError(msg)),
        name: "CriticalError"
    };
}

export default CriticalError;