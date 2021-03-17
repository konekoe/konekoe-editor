import GenericError from "./GenericError";
import { MessageError } from "../../types";

function MessageError(msg: string, id: string): MessageError {
    return {
        ...(GenericError(msg)),
        name: "MessageError",
        id
    };
}

export default MessageError;