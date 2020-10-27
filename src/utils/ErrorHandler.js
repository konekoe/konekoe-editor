import MessageOverlay from "../components/utils/MessageOverlay.js";
import Modal from "../components/utils/Modal.js";

// Input: error object
// Output: html string to be displayed.

function ErrorHandler(err) {
  switch (err.name) {
    case "CriticalError":
      const errorOverlay = new MessageOverlay({ show: true, coverScreen: true, slot: "error" });
      errorOverlay.innerHTML = `<h1 slot="content" style="color: red;">Error: ${ err.message }</h1>`;
      
      return errorOverlay.outerHTML;
    
    case "MinorError":
        const errorModal = new Modal({ show: true, cancel: "", accept: "OK", coverScreen: true, slot: "error" });
        errorModal.innerHTML = `
        <h1 slot="content">
        Error: ${ err.message }
        </h1>
        <p>
          ${ err.reason }
        </p>
        `;
        return `${ errorModal.outerHTML }`;

    default:
      console.log(err.message);
      return "";
  }
};

export default ErrorHandler;