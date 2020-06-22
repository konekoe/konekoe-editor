import * as ace from "ace-builds/src-min-noconflict/ace";
import * as aceModes from "ace-builds/src-min-noconflict/ext-modelist.js";
import HttpMessageHandler from "../utils/HttpMessageHandler.js";
import "../utils/WaitOverlay.js";
import "ace-builds/webpack-resolver";
import "./ActionBar.js";

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
  #editor{
    flex: 1;
    height: 100%;
  }
  </style>
  
  <action-bar id="actionBar">
  </action-bar>

  <wait-overlay id="waitOverlay">
  </wait-overlay>

  <div id="editor">
  </div>
`;

class CodeEditor extends HTMLElement {
  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: "open" }); // Create a shadow root for this element.

    this._sessions = {}; // Map of form ID string => Ace EditSession instance.
    this._messageHandler = new HttpMessageHandler((this.hasAttribute("message-end-point")) ? this.getAttribute("message-end-point") : "http://localhost:3001/");
    this._editor;
    this._config;

    if (this.hasAttribute("config")) {
      try {
        const temp = JSON.parse(this.getAttribute("config"));
        
        if (temp && typeof temp === "object") 
          this._config = temp;

      }
      catch (err) {
        throw Error("Malformed JSON data.");
      }
    } 



    const node = wrapperTemplate.content.cloneNode(true); // Clone template node.
    
    this._actionBar = node.getElementById("actionBar");
    this._waitOverlay = node.getElementById("waitOverlay");

    this.addEditor = this.addEditor.bind(this);
    this.changeEditor = this.changeEditor.bind(this);
    this.removeEditor = this.removeEditor.bind(this);
    this.sendCode = this.sendCode.bind(this);

    // Handle action bar events
    this._actionBar.addEventListener("tab-created", this.addEditor, false);
    this._actionBar.addEventListener("tab-changed", this.changeEditor, false);
    this._actionBar.addEventListener("tab-removed", this.removeEditor, false);
    this._actionBar.addEventListener("run", this.sendCode, false);

    this._container = node.getElementById("editor"); // This elements content will be placed here.
    this._shadow.appendChild(node);
  }

  connectedCallback() {

    this._editor = ace.edit(this._container);
    // Set style and default mode.
    this._editor.setTheme("ace/theme/cobalt");
    this._editor.setValue("");

    this._sessions.default = this._editor.session;
    this._editor.setReadOnly(true);

    // Finally attach to shadow root.
    this._editor.renderer.attachToShadowRoot();

    if (this._config) {
      if (this._config.tabs)
        this._config.tabs.map(item => {
          item.noDelete = item.noDelete === "true";
          this.addEditor({ data: { target: this._actionBar.tabContainer.createTab(item), ...item } });
        });

      if (this._config.tabCreation === "false")
        this._actionBar.tabContainer.removeAddButton();
    }

  }

  addEditor({ data }) {
    const session = new ace.EditSession(data.value || "");
    
     // Exctract file extension
     // If no name is given use "" indicating a text file
     // If the name does not contain a file extension use ""
    let modeName = (data.target.name) ? (data.target.name.match(/\.[0-9a-z]+$/i) || [""])[0] : "";

    session.setMode(aceModes.getModeForPath(modeName).mode);

    session.filename = data.target.name;
    
    this._sessions[data.target.id] = session;
    this.setSession(data.target.id);
  }

  changeEditor({ data }) {
    this.setSession(data.target.id);
  }

  removeEditor({ data }) {
    this.setSession("default");
    delete this._sessions[data.target.id];
  }

  setSession(id) {
    this._editor.setReadOnly(id === "default");
    
    this._editor.setSession(this._sessions[id]);
  }

  async sendCode() {
    const data = Object.values(this._sessions)
    .filter(session => session.filename) // Remove sessions without a filename, such as the default session
    .reduce((acc, curr) => {
      acc[curr.filename] = curr.getDocument().getValue();
      return acc;
    }, {});
    this._waitOverlay.show();

    // TODO: more robust error handling.
    try {
      await this._messageHandler.sendMessage(data, (this.hasAttribute("submission-path")) ? this.getAttribute("submission-path") : "");
    }
    catch (err) {
      alert(err.message);
    }
    
    this._waitOverlay.close();
  }
}

customElements.define("code-editor", CodeEditor);

export default CodeEditor;