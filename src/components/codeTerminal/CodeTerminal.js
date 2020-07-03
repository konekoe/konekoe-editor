import { Terminal }  from "xterm/lib/xterm.js";
import { FitAddon } from "xterm-addon-fit";
import { AttachAddon } from "xterm-addon-attach";

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

class CodeTerminal extends HTMLElement {

  constructor() {
    super();
    this._shadow = this.attachShadow({mode: "open"}); // Create a shadow root for this element.
    
    this._terminal = new Terminal();
    this._fitAddon = new FitAddon();

    const socket = new WebSocket('ws://localhost:4000');

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


  connectedCallback() {
    const terminalWrapper = this._shadow.getElementById("terminal");

    this._terminal.open(terminalWrapper);

    setTimeout(() => this._fitAddon.fit(), 0); // Hack to make this call occur once the page has loaded.
  }


}

customElements.define("code-terminal", CodeTerminal);

export default CodeTerminal;