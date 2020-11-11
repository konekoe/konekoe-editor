import { push } from "../components/utils/state/errorSlice.js";
import { MessageError } from "./errors";

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
        
          // TODO: Replace with store action.
        document.dispatchEvent(new CustomEvent(msgObj.type, { detail: { error: msgObj.error, payload: msgObj.payload } }));
      }
      catch (err) {
        return this._store.dispatch(push(new MessageError("Malformed message data.")));
      }
    };

    document.addEventListener("terminal_write", ({ detail }) => {
      this._sendMessage("terminal_input", detail);
    });

    document.addEventListener("submission", ({ detail }) => {
      this._sendMessage("code_submission", detail);
    });
  }

  async open() {
    return new Promise((resolve) => {
      this._socket.addEventListener("open", (event) => {
        this._socket.send(JSON.stringify({ type: "server_connect", payload: { token: this._token } }));
      });
  
      document.addEventListener("server_connect", ({ detail }) => {
        // TODO: If an error occurs this open() will never resolve.
        document.removeEventListener("server_connect", this);

        resolve(detail);
      });  
    });
  }

  async _sendMessage(type, payload) {
   this._socket.send(JSON.stringify({ type, payload }))
  }

  
}

export default WebSocketMessageHandler;