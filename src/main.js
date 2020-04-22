import CodeEditor from "./components/codeEditor/CodeEditor.js"
import Grid from "./utils/grid.js";

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
    ::slotted(#test) {
      grid-column-start: left;
      grid-column-end: right;
      grid-row-start: top;
      grid-row-end: middle-top;
    }
    
  </style>
  <slot name="default">
    <code-editor id="default"></code-editor>
  </slot>
`;

class EditorContainer extends HTMLElement {
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

  get grid() {
    return this._grid;
  }

  constructor() {
    super();
    // Create a shadow root for this element.
    this._shadow = this.attachShadow({mode: "open"});

    // TODO: Allow users to define the dimensions of the css grid.
    this._grid = new Grid(3,3);

    
    const content = wrapperTemplate.content.cloneNode(true);
    
    this._shadow.appendChild(content);

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
      this._shadow.innerHTML = `<h1>Error: ${ err.message }</h1>`;
    }

    
  }

  // Throws an error if child elements overlap.
  _childNodesToShadow(style) {

    // The children won't fit in the grid.
    if (this.childElementCount > this.grid.cells)
      throw Error("Too many children.");

    // Create stylings for each child.
    for (let node of this.childNodes) {
      if (node.nodeName === "#text")
        continue;

        node.id = this._generateGuid(node.nodeName);

        style.innerHTML += this._generateComponentStyle(node);
    }

    // Add child nodes to template slot.
    // Note: This step could be skipped by using the default unnamed slot. However, the default slot can't have fallback content.
    // Note: Raw text should be ignored.
    this.childNodes.forEach(node => { (node.nodeName !== "#text") ? node.slot = "default" : null });
  }

  // If element has styling attributes (startCol, endCol, startRow, endRow) determine a styling based on them
  _generateComponentStyle(node) {
    const styleObj = {};

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