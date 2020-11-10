import MessageOverlay from "../components/utils/MessageOverlay.js";
import Modal from "../components/utils/Modal.js";
import { topErrorSelector, pop } from "../components/utils/state/errorSlice.js";
import watch from "redux-watch";

// Input: error object
// Output: html string to be displayed.



class ErrorHandler {
  constructor(htmlNode, store) {
    const errorModal = new Modal({ cancel: "", accept: "OK", coverScreen: true, slot: "error" });

    htmlNode.appendChild(errorModal);
    
    const newErrorWatcher = watch(store.getState, "error.queue", (newVal, oldVal) => newVal.length > oldVal.length);

    store.subscribe(newErrorWatcher(
      (newVal) => {
        errorModal.show();
      }
    ));
  }

  showError(err) {
    switch (err.name) {
      case "CriticalError":
        const errorOverlay = new MessageOverlay({ show: true, coverScreen: true, slot: "error" });
        errorOverlay.innerHTML = `<h1 slot="content" style="color: red;">Error: ${ err.message }</h1>`;
        
        return errorOverlay.outerHTML;
      
      case "MinorError":
          const errorModal = 
          errorModal.innerHTML = `
          <div slot="content">
            <h1>
            Error: ${ err.title }
            </h1>
            <p>
              ${ err.message }
            </p>
          </div>
          `;
          return `${ errorModal.outerHTML }`;
  
      default:
        console.log(err.message);
        return "";
    }
  }
}

export default ErrorHandler;