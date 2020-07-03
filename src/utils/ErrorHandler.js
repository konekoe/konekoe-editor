import "../components/utils/WaitOverlay.js";
import "../components/utils/Modal.js";

// Input: error object
// Output: html string to be displayed.
function ErrorHandler(err) {
  switch (err.name) {
    case "CriticalError":
      return `<wait-overlay show>${ err.message }</wait-overlay>`;
    
    case "MinorError":
        return `<pop-up-modal show>${ err.message }</pop-up-modal>`;

    default:
      console.log(err.message);
      return "";
  }
};

export default ErrorHandler;