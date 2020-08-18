import ErrorHandler from "../../utils/ErrorHandler.js";

class ErrorHandlingHTMLElement extends HTMLElement {
  constructor() {
    super();
  }

  displayError(error) {
    this.innerHTML += ErrorHandler(error);

    return true;
  };

}

export default ErrorHandlingHTMLElement;