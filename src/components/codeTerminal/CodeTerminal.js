import { Terminal }  from "xterm/lib/xterm.js";
import { FitAddon } from "xterm-addon-fit";
import ErrorHandlingHTMLElement from "../utils/ErrorHandlingHTMLElement.js";
import styles from "xterm/css/xterm.css";


const wrapperTemplate = document.createElement("template");
wrapperTemplate.innerHTML = `
  <style>
  :host{
    position: relative;
    display: flex;
    min-height: 1rem;
    height: 100%;
    flex-direction: column;
  }

  ${
    styles[0][1]
  }

  #wrapper {
    width: 100%;
    height: 100%;
  }

  #terminal {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    background-color: black;
    overflow-wrap: break-word;
    scrollbar-color: #555555 #011e3a;
  }
  
  .terminal {
    padding: 0.5rem 0rem 0rem 0.5rem;
  }
  
  </style>

  <div id="wrapper">
    <div id="terminal">
    </div>
  </div>
`;

class CodeTerminal extends ErrorHandlingHTMLElement {

  constructor() {
    super();
    this._shadow = this.attachShadow({mode: "open"}); // Create a shadow root for this element.
    
    this._terminal = {};
    this._fitAddon = {};

    if (!this.hasAttribute("target"))
      throw Error("No websocket");
    
    

    this._terminal = new Terminal();
    this._fitAddon = new FitAddon();

    const socket = new WebSocket();

    socket.onmessage = ({ data }) => {
      this._terminal.write(data);
    };

    this._terminal.onKey(({ key }) => {
      socket.send(key);
    });

    this._terminal.loadAddon(this._fitAddon);
   
    const node = wrapperTemplate.content.cloneNode(true); // Clone template node.
    
    this._shadow.appendChild(node);
  }




}

customElements.define("code-terminal", CodeTerminal);

export default CodeTerminal;