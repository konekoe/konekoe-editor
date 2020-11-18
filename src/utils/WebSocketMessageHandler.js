import { push } from "../components/utils/state/errorSlice.js";
import { resolveSubmission, submissionInit, submissionWatcherFactory } from "../components/utils/state/submissionsSlice.js";
import { MessageError, MinorError, CriticalError } from "./errors";

class WebSocketMessageHandler {
  constructor(address, token, store) {

    this._socket = new WebSocket(address);
    this._token = token;

    this._store = store;

    this.open = this.open.bind(this);
    this._sendMessage = this._sendMessage.bind(this);

    this._socket.onmessage = ({ data }) => {
      try {
        const msgObj = JSON.parse(data);

        if (!msgObj.type)
          return this._store.dispatch(push(new MessageError("Invalid message.")));
        
        this._handleMessage(msgObj);
      }
      catch (err) {
        console.log(err);
        return this._store.dispatch(push(new MessageError("Malformed message data.")));
      }
    };

    document.addEventListener("terminal_write", ({ detail }) => {
      this._sendMessage("terminal_input", detail);
    });

    this._store.subscribe(submissionWatcherFactory(this._store, "activeSubmissions")((newState, oldState) => {
      // Find a submission. The data must have changed and be a non null object.
      const submission = Object.entries(newState).find(sub => sub[1] && !oldState[sub[0]]);

      // Check that a submission was found.
      // This function is triggered when the results of a submission are recorded in which case we don't want to do anything.
      if (submission) {
        this._sendMessage("code_submission", { id: submission[0], files: submission[1] });
      }
      
    }));
  }

  async open() {
    return new Promise((resolve) => {
      this._socket.addEventListener("open", (event) => {
        this._socket.send(JSON.stringify({ type: "server_connect", payload: { token: this._token } }));
      });
  
      document.addEventListener("server_connect", ({ detail }) => {
        document.removeEventListener("server_connect", this);

        resolve(detail);
      });  
    });
  }

  async _sendMessage(type, payload) {
   this._socket.send(JSON.stringify({ type, payload }))
  }

  _handleMessage({type, error, payload}) {
    console.log(payload);
    switch (type) {
      case "server_connect":
        if (error)
          return this._store.dispatch(push(new CriticalError(error.message)));
        return this._store.dispatch(submissionInit(payload));
      case "code_submission":
        if (error)
          return this._store.dispatch(push(new MinorError(error.message, error.name)));
        return this._store.dispatch(resolveSubmission(payload));
      default:
        return this._store.dispatch(push(new MessageError("Invalid message.")));
    }
  }

  
}

export default WebSocketMessageHandler;