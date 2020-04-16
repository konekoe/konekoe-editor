import CodeEditor from "./components/codeEditor/CodeEditor.js"

const wrapperTemplate = document.createElement("template");
wrapperTemplate.innerHTML = `
  <style>
    :host{
      display: flex;
      min-height: 1rem;
      flex-direction: column;
    }
    #editorWrapper{
      flex: 1;
      height: 100%;
    }
  </style>
  <div id="editorWrapper">
  </div>
`;

class Editor extends HTMLElement {
  constructor() {
    super();

    // Create a shadow root for this element.
    this.shadow = this.attachShadow({mode: "open"});
    const content = wrapperTemplate.content.cloneNode(true);

    const codeEditor = document.createElement("code-editor");
    
    content.getElementById("editorWrapper").appendChild(codeEditor);
    this.shadow.appendChild(content);
    
  }
}

customElements.define("konekoe-editor", Editor);
export default Editor;