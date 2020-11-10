import StateHandlingHTMLElement from "./StateHandlingHTMLElement.js";
import { push } from "./errorSlice.js";

class ErrorHandlingHTMLElement extends StateHandlingHTMLElement {
  constructor(state) {
    super(state);
  }

  displayError(error) {
    this._state.dispatch(push(error));
  };

}

export default ErrorHandlingHTMLElement;