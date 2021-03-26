import GenericError from "./GenericError";

class MinorError extends GenericError {
	name = "MinorError";
	title: string;

	constructor(msg: string, title: string) {
		super(msg);
		this.title = title;
	}
}

export default MinorError;