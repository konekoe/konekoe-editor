class MinorError extends Error {
  constructor(msg) {
    super(msg);
    this.name = "MinorError";
  }
}

export default MinorError;