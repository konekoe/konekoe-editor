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

    #default {
      grid-column-start: left;
      grid-column-end: right;
      grid-row-start: top;
      grid-row-end: bottom;
    }
  </style>
  <slot name="default">
    <code-editor id="default"></code-editor>
  </slot>
`;

class EditorContainer extends HTMLElement {
  constructor() {
    super();
    // Create a shadow root for this element.
    this._shadow = this.attachShadow({mode: "open"});

    const content = wrapperTemplate.content.cloneNode(true);
    
    this._shadow.appendChild(content);

    try {
      // Add child nodes to template slot.
      // Note: This step could be skipped by using the default unnamed slot. However, the default slot can't have fallback content.
      // Note: Raw text should be ignored.
      this.childNodes.forEach(node => { (node.nodeName !== "#text") ? node.slot = "default" : null });

    }
    catch (err) {
      this._shadow.innerHTML = `<h1>Error: ${ err.message }</h1>`;
    }

    
  }
}

customElements.define("konekoe-editor", EditorContainer);
export default EditorContainer;