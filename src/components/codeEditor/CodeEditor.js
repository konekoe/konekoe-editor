import * as ace from "ace-builds/src-noconflict/ace";
import * as aceModes from "ace-builds/src-noconflict/ext-modelist.js";
import ErrorHandlingHTMLElement from "../utils/ErrorHandlingHTMLElement.js";
import { CriticalError, MinorError } from "../../utils/errors/index.js";
import { URL_REGEX } from "../../utils/functions.js";
import "../utils/ActionButton.js";
import "../utils/MessageOverlay.js";
import "ace-builds/webpack-resolver.js";
import "../utils/ActionBar.js";


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

  #editor {
    scrollbar-color: #555555 #011e3a;
  }

  #editor ::-webkit-scrollbar {
    background-color: #011e3a;
  }

  #editor ::-webkit-scrollbar-thumb {
    background: #555555; 
  }
  </style>
  
  <action-bar id="actionBar">
    <action-button slot="content" id="runButton" secondary color="red">
      Submit
    </action-button>
  </action-bar>

  <message-overlay id="messageOverlay">
    <h1 slot="content">Please wait</h1>
  </message-overlay>

  <div id="editor" part="konekoe-scrollable">
  </div>
  <slot name="error">
  </slot>
`;

class CodeEditor extends ErrorHandlingHTMLElement {
  constructor() {
    super();
    super.displayError.bind(this);
    
    this._shadow = this.attachShadow({ mode: "open" }); // Create a shadow root for this element.

    this._sessions = {}; // Map of form ID string => Ace EditSession instance.
    this._editor;
    this._config;

    if (this.hasAttribute("config")) {
      try {
        const temp = JSON.parse(this.getAttribute("config"));
        
        if (temp && typeof temp === "object") 
          this._config = temp;

      }
      catch (err) {
        super.displayError(new CriticalError("Malformed JSON data."));
      }
    } 

    const node = wrapperTemplate.content.cloneNode(true); // Clone template node.
    
    this._actionBar = node.getElementById("actionBar");
    this._messageOverlay = node.getElementById("messageOverlay");

    this.addEditor = this.addEditor.bind(this);
    this.changeEditor = this.changeEditor.bind(this);
    this.removeEditor = this.removeEditor.bind(this);
    this.sendCode = this.sendCode.bind(this);
    this._handleSubmissionResult = this._handleSubmissionResult.bind(this);

    // Handle action bar events
    this._actionBar.addEventListener("tab-created", this.addEditor, false);
    this._actionBar.addEventListener("tab-changed", this.changeEditor, false);
    this._actionBar.addEventListener("tab-removed", this.removeEditor, false);
    
    // Set click handlers 
    node.getElementById("runButton").onclick = this.sendCode;
        

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
        this._config.tabs.map(async (item, index) => {
          item.noDelete = item.noDelete;
          item.setActive = index === 0;
          
          if (URL_REGEX.test(item.value)) {
            try {
              item.value = await this._messageHandler.getMessage("", item.value);
            }
            catch (err) {
              this.dispatchEvent(new ErrorEvent("error", { error: new MinorError(err.message) }))
            }
          }
            

          this.addEditor({ data: { target: this._actionBar.tabContainer.createTab(item), ...item } });
        });

      if (!this._config.tabCreation)
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
    
    if (data.setActive)
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

  _handleSubmissionResult({ detail }) {
    try {
      this._messageOverlay.close();

      if (detail.error)
        throw new MinorError(detail.error.message);
      
      // TODO: Display points received from submission.
      
      document.removeEventListener("code_submission", this._handleSubmissionResult);
    }
    catch (err) {
      super.displayError(err);
    }
  }

  async sendCode() {
    const files = Object.values(this._sessions)
    .filter(session => session.filename) // Remove sessions without a filename, such as the default session
    .reduce((acc, curr) => {
      acc[curr.filename] = curr.getDocument().getValue();
      return acc;
    }, {});
    this._messageOverlay.show();

    document.addEventListener("code_submission", this._handleSubmissionResult);

    // TODO: Add redux making id field redundant.
    document.dispatchEvent(new CustomEvent("submission", { detail: { id: this.dataset.sessionId, files } }));
  }
}

customElements.define("code-editor", CodeEditor);

export default CodeEditor;