import ErrorHandler from "../../utils/ErrorHandler.js";

class ErrorHandlingHTMLElement extends HTMLElement {
  constructor() {
    super();

    onerror = (msg, url, lineNo, columnNo, error) => {
      this.innerHTML += ErrorHandler(error);   
      return true;
    };

    this.addEventListener("error", (event) => {
      this.innerHTML += ErrorHandler(event.error);   
      return true;
    });


  }
}

export default ErrorHandlingHTMLElement;