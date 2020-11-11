import GenericError from "./GenericError.js";

function MinorError(msg, title) {
    Object.assign(this, new GenericError(msg));
    this.name = "MinorError";
    this.title = title || this.name;
};

export default MinorError;