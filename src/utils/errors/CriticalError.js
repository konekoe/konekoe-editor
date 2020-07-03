class CriticalError extends Error {
  constructor(msg) {
    super(msg);
    this.name = "CriticalError";
  }
}

export default CriticalError;