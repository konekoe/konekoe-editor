import { Terminal }  from "xterm/lib/xterm.js";
import { FitAddon } from "xterm-addon-fit";
import { CriticalError, MinorError } from "../../utils/errors/";
import "../utils/ActionButton.js";
import ErrorHandlingHTMLElement from "../utils/state/ErrorHandlingHTMLElement.js";
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
    background-color: black;
  }

  #terminal {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    background-color: black;
    overflow-wrap: break-word;
    scrollbar-color: #555555 #011e3a;
  }

  #terminal ::-webkit-scrollbar {
    background-color: #011e3a;
  }

  #terminal ::-webkit-scrollbar-thumb {
    background: #555555; 
  }
  
  .terminal {
    padding: 0.5rem 0rem 0rem 0.5rem;
  }
  
  </style>

  <div id="wrapper">
    <action-button id="clearButton" secondary="true" color="white">
     Clear
    </action-button>
    <div id="terminal" part="konekoe-scrollable">
    </div>
  </div>
  <slot name="error">
  </slot>
`;

class CodeTerminal extends ErrorHandlingHTMLElement {
  static get observedAttributes() { return ["style"]; }

  constructor(store) {
    super(store);
    super.displayError.bind(this);

    this._shadow = this.attachShadow({mode: "open"}); // Create a shadow root for this element.
    this._webSocketConnect = this._webSocketConnect.bind(this);
    
    this._terminal = new Terminal();
    this._fitAddon = new FitAddon();

    this._terminal.onKey(({ key }) => {
      document.dispatchEvent(new CustomEvent("terminal_write", { detail: key }));
    });

    document.addEventListener("terminal_output", ({ detail }) => {
      if (detail.error)
        return super.displayError(Error(detail.error.message));

      this._terminal.write(detail.payload.data);
    });

    this._terminal.loadAddon(this._fitAddon);

    const node = wrapperTemplate.content.cloneNode(true); // Clone template node.

    node.getElementById("clearButton").onclick = () => {
      this.displayError({ name: "Error", msg: "test" });
    };
    
    this._shadow.appendChild(node);
  }

  connectedCallback() {
    this._webSocketConnect();

    const terminalWrapper = this._shadow.getElementById("terminal");

    this._terminal.open(terminalWrapper);
  }


  attributeChangedCallback(name, oldValue, newValue) {
    if (!newValue) {
      setTimeout(() => {
        const terminalWrapper = this._shadow.getElementById("terminal");
        terminalWrapper.innerHTML = "";
        
        this._terminal.open(terminalWrapper);
        this._fitAddon.fit();
      }, 0); // Hack to make this call occur once the page has loaded.
    }
    else {
      
    }
  }

  _webSocketConnect() {
    this._terminal.clear();
    this._terminal.write("Submission results will be shown here.");
  }

}

customElements.define("code-terminal", CodeTerminal);

export default CodeTerminal;