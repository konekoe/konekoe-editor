import "../components/utils/MessageOverlay.js";
import Modal from "../components/utils/Modal.js";

// Input: error object
// Output: html string to be displayed.

function ErrorHandler(err) {
  switch (err.name) {
    case "CriticalError":
      return `<wait-overlay show>${ err.message }</wait-overlay>`;
    
    case "MinorError":
        const errorModal = new Modal({ show: true, cancel: "", accept: "OK" });
        errorModal.innerHTML = `<h1 slot="content">Error: ${ err.message }</h1>`;
        return `${ errorModal.outerHTML }`;

    default:
      console.log(err.message);
      return "";
  }
};

export default ErrorHandler;