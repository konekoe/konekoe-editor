import CodeEditor from "./components/codeEditor/CodeEditor.js"

const wrapperTemplate = document.createElement("template");
wrapperTemplate.innerHTML = `
  <style>
    :host{
      display: grid;
      min-height: 1rem;
      grid-template-columns: [left] 33% [center-left] 33% [center-right] 33% [right];
      grid-template-rows: [top] 33% [middle-top] 33% [middle-bottom] 33% [bottom];
      background-color: #00162a;
      color: white;
    }
    ::slotted(#editor) {
      grid-column-start: center-left;
      grid-column-end: right;
      grid-row-start: top;
      grid-row-end: bottom;
    }
    ::slotted(#text) {
      grid-column-start: left,
      grid-column-end: center-left;
      grid-row-start: middle-bottom;
      grid-row-end: bottom;
    }
  </style>
  <slot></slot>
`;

class EditorContainer extends HTMLElement {
  constructor() {
    super();
    // Create a shadow root for this element.
    try {
      this._shadow = this.attachShadow({mode: "open"});
      
      
      const content = wrapperTemplate.content.cloneNode(true);
      const style = document.createElement("style");

      style.innerHTML = `
      #editorWrapper{
        display: grid;
        
      }
      `;

      this._shadow.appendChild(content);

    }
    catch (err) {
      this.innerHTML = `<h1>Error: ${ err.message }</h1>`;
    }
    
  }
}

customElements.define("konekoe-editor", EditorContainer);
export default EditorContainer;