import * as ace from "ace-builds/src-min-noconflict/ace";

import "ace-builds/webpack-resolver";
import "./ActionBar.js";

const wrapperTemplate = document.createElement("template");
wrapperTemplate.innerHTML = `
  <style>
  :host{
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

  <div id="editor">
  </div>
`;

class CodeEditor extends HTMLElement {
  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: "open" }); // Create a shadow root for this element.

    this._sessions = {}; // Map of form ID string => Ace EditSession instance.
    this._editor;

    const node = wrapperTemplate.content.cloneNode(true); // Clone template node.
    
    const actionBar = node.getElementById("actionBar");

    this.addEditor = this.addEditor.bind(this);
    this.changeEditor = this.changeEditor.bind(this);
    this.removeEditor = this.removeEditor.bind(this);

    // Handle action bar events
    actionBar.addEventListener("tab-created", this.addEditor, false);
    actionBar.addEventListener("tab-changed", this.changeEditor, false);
    actionBar.addEventListener("tab-removed", this.removeEditor, false);

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
  }

  addEditor({ data }) {
    const session = new ace.EditSession("");
    
    session.setMode("ace/mode/javascript");
    
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
}

customElements.define("code-editor", CodeEditor);

export default CodeEditor;