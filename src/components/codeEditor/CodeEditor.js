import * as ace from "ace-builds/src-min-noconflict/ace";
import "ace-builds/webpack-resolver";

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
  <div id="editor">
  </div>
`;

class CodeEditor extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({mode: "open"}); // Create a shadow root for this element.
    this.editor;

    const node = wrapperTemplate.content.cloneNode(true); // Clone template node.
    this.container = node.getElementById("editor"); // This elements content will be placed here.
    this.shadow.appendChild(node);
  }
  connectedCallback() {

    this.editor = ace.edit(this.container);
    // Set style and default mode.
    this.editor.setTheme("ace/theme/cobalt");
    this.editor.session.setMode("ace/mode/javascript");
    this.editor.setValue("the new text here");

    // Finally attach to shadow root.
    this.editor.renderer.attachToShadowRoot();
  }
}

customElements.define("code-editor", CodeEditor);

export default CodeEditor;