import MessageOverlay from "../components/utils/MessageOverlay.js";
import Modal from "../components/utils/Modal.js";
import { topErrorSelector, pop } from "../components/utils/state/errorSlice.js";
import watch from "redux-watch";

// Input: error object
// Output: html string to be displayed.



class ErrorHandler {
  constructor(htmlNode, store) {
    const errorModal = new Modal({ cancel: "", accept: "OK", coverScreen: true, slot: "error" });
    const errorOverlay = new MessageOverlay({ coverScreen: true, slot: "error" });

    this._store = store;
    
    this._modal = htmlNode.appendChild(errorModal);
    this._overlay = htmlNode.appendChild(errorOverlay);

    this.handleError = this.handleError.bind(this);
    
    const newErrorWatcher = watch(store.getState, "error.queue", (newVal, oldVal) => newVal.length > oldVal.length);

    store.subscribe(newErrorWatcher(this.handleError));
  }

  handleError(errQueue) {
    const err = errQueue[errQueue.length - 1];

    switch (err.name) {
      case "CriticalError":
        
        this._overlay.innerHTML = `<h1 slot="content" style="color: red;">Error: ${ err.msg }</h1>`;
        
        this._overlay.show();
        break;
      
      case "MinorError": 
          this._modal.innerHTML = `
          <div slot="content">
            <h1>
            Error: ${ err.title }
            </h1>
            <p>
              ${ (err.title === "GraderError") ? "The grader finished with an error. Check the terminal for feedback." : err.msg }
            </p>
          </div>
          `;
          this._modal.show();
          break;
  
      default:
        console.log(err.msg);
        break;
    }

    // Remove the error from the queue.
    this._store.dispatch(pop());
  }
}

export default ErrorHandler;