import StateHandlingHTMLElement from "./StateHandlingHTMLElement.js";
import { push } from "./errorSlice.js";

class ErrorHandlingHTMLElement extends StateHandlingHTMLElement {
  constructor(store) {
    super(store);
  }

  displayError(error) {
    this._store.dispatch(push(error));
  };

}

export default ErrorHandlingHTMLElement;