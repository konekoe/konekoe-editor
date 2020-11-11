function GenericError(msg) {
  this.name = "Error";
  this.msg = msg || "An error occured.";
};

export default GenericError;