import ErrorHandlingHTMLElement from "./components/utils/ErrorHandlingHTMLElement.js";
import { CriticalError, MinorError } from "./utils/errors/index.js";
import "./components/codeEditor/CodeEditor.js";
import "./components/infoBox/InfoBox.js";
import "./components/codeTerminal/CodeTerminal.js";
import "./components/utils/ActionBar.js"

const SESSION_CLASS_NAME = "editorSession";

const wrapperTemplate = document.createElement("template");
wrapperTemplate.innerHTML = `
  <style>
    :host {
      display: flex;
      flex-direction: column;
      height: 100vh;
    }
    #container {
      display: grid;
      height: 100%;
      grid-template-columns: [left] 33% [center-left] 33% [center-right] 33% [right];
      grid-template-rows: [top] 33% [middle-top] 33% [middle-bottom] 33% [bottom];
      column-gap: 0.1rem;
      row-gap: 0.1rem;
      background-color: #555555;
      color: white;
    }
  </style>

  <action-bar noAdd id="actionBar">
  </action-bar>
  
  <slot id="container" name="content">
    <code-editor></code-editor>
  </slot>
`;

class EditorContainer extends ErrorHandlingHTMLElement {
  static get defaultStyling() {
    return `
    #default {
      grid-column-start: left;
      grid-column-end: right;
      grid-row-start: top;
      grid-row-end: bottom;
    }`;
  }

  // TODO: Allow users to define grid lines.
  get gridLines() {
    return ["left", "center-left", "center-right", "right", "top", "middle-top", "middle-bottom", "bottom"];
  }

  static get _styleAttributesMap() {
    return {
      "start-col": "grid-column-start",
      "end-col": "grid-column-end" , 
      "start-row": "grid-row-start",
      "end-row": "grid-row-end"
    };
  }

  // Placeholder for future attributes.
  static get validAttributes() {
    return [];
  }

  constructor() {
    super();

    // Create a shadow root for this element.
    this._shadow = this.attachShadow({mode: "open"});

    this._activeSession = "default";

    this._changeSession = this._changeSession.bind(this);
    this._addSession = this._addSession.bind(this);
    this.setSession = this.setSession.bind(this);

    const node = wrapperTemplate.content.cloneNode(true);
    
    this._actionBar = node.getElementById("actionBar");
    this._container = node.getElementById("container");

    this._actionBar.addEventListener("tab-changed", this._changeSession, false);

    this._shadow.appendChild(node);
  }

  connectedCallback() {

    // Filter session wrapper classes.
    const sessions = Array.from(this.childNodes).filter(child => child.classList && child.classList.contains(SESSION_CLASS_NAME));

    // Lift session elements outside of wrappers and add them to the _sessions map.
    
    let flag = true;

    for (let session of sessions) {
      flag = this._addSession(session, flag);
    }

    // Create stylings for child elements.
    try {
      const style = document.createElement("style");

      if (!this.childElementCount) {
        style.innerHTML = EditorContainer.defaultStyling;
      }
      else {
        this._childNodesToShadow(style);
      }

      this._shadow.appendChild(style);
    }
    catch (err) {
      throw new CriticalError(err.message);
    }

    if (this._activeSession === "default")
      this._actionBar.style.display = "none";

  }

  _addSession(session, flag) {
    let children = session.childNodes;
  
    let sessionId = "";
    try {  
      sessionId = this._actionBar.tabContainer.createTab({ name: session.getAttribute("name"), noDelete: true, setActive: flag }).id;
    }
    catch (err) {
      this.dispatchEvent(new ErrorEvent("custom-error", { error: new MinorError("Missing name attribute.") }));
      return flag;
    }

    children.forEach(child => {
      if (child.nodeName !== "#text") {
        child.slot = "content";
        child.style.display = (flag) ? null : "none";
        child.classList.add(sessionId);
      }
    });

    // Make the first session active.
    if (flag) {
      flag = false;
      this._activeSession = sessionId;
    }

    session.outerHTML = session.innerHTML;  

    return flag;
  }

  _changeSession({ data }) {
    this.setSession(data.target.id);
  }

  setSession(id) {
    for (let element of document.getElementsByClassName(this._activeSession)) {
      element.style.display = "none";
    }
    
    this._activeSession = id;

    for (let element of document.getElementsByClassName(this._activeSession)) {
      element.style.display = null;
    }
  }

  _childNodesToShadow(style) {

    // Create stylings for each child.
    for (let node of this.childNodes) {
      if (node.nodeName === "#text")
        continue;

        node.id = this._generateGuid(node.nodeName);

        style.innerHTML += this._generateComponentStyle(node);
    }
  }

  // If element has styling attributes (startCol, endCol, startRow, endRow) determine a styling based on them
  _generateComponentStyle(node) {
    const styleObj = {
      margin: "0;"
    };

    // Assume style attributes only define start and end grid lines.
    for (let {name, value} of node.attributes) {
      if (EditorContainer._styleAttributesMap[name] && this.gridLines.includes(value)) {
        styleObj[EditorContainer._styleAttributesMap[name]] = `${value};`;
      }
    }

    // NOTE: JSON.stringify produces " characters around strings and , characters between properties which aren't valid in css.
    // The replace statement removes these characters.
    return `::slotted(#${ node.id }) ${ JSON.stringify(styleObj).replace(/[\",]/g, "") }`
  }

  _generateGuid(name) {
    let s4 = () => {
      return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    
    return `${ name }-${ s4() }${ s4() }${ s4() }`;
  }
}

customElements.define("konekoe-editor", EditorContainer);
export default EditorContainer;