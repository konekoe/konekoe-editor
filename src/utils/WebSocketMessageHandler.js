import { MinorError } from "./errors/index.js";

class WebSocketMessageHandler {
  constructor(address, token) {
    this._socket = new WebSocket(address);
    this._token = token;

    this.open = this.open.bind(this);

    this._socket.onmessage = ({ data }) => {
      try {
        const msgObj = JSON.parse(data);

        if (!msgObj.type)
          throw Error("");

        if (msgObj.error) {
          document.dispatchEvent(new ErrorEvent("MessageError", { error: new Error(msgObj.error) }));
          return;
        }

        document.dispatchEvent(new CustomEvent(msgObj.type, { detail: msgObj.payload }));
      }
      catch (err) {
        document.dispatchEvent(new ErrorEvent("MessageError", { error: new Error("Malformed message data") }));
      }
    };

  }

  async open() {
    return new Promise((resolve) => {
      this._socket.addEventListener("open", (event) => {
        this._socket.send(JSON.stringify({ type: "server_connect", payload: { token: this._token } }));
      });
  
      document.addEventListener("server_connect", ({ detail }) => {
        // TODO: If an error occurs this open() will never resolve.
        resolve(detail);
      });  
    });
  }

  async sendMessage(data, path="", fullURL=false) {
   // TODO;
  }

  
}

export default WebSocketMessageHandler;