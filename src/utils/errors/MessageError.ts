import GenericError from "./GenericError";

class MessageError extends GenericError {
    name = "MessageError";
    id: string;
    title?: string;
    
	constructor(msg: string, id: string, title?: string) {
		super(msg);
		this.id = id;
		this.title = title;
	}
}

export default MessageError;