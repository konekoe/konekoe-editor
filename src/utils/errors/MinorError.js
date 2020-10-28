class MinorError extends Error {
  constructor(msg, title) {
    super(msg);
    this.name = "MinorError";
    this.title = title || this.name;
  }
}

export default MinorError;