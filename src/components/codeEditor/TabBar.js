import "./ActionButton.js";
import "./Tab.js";
import Tab from "./Tab.js";

const wrapperTemplate = document.createElement("template");
wrapperTemplate.innerHTML = `
  <style>
  :host {
    width: 100%;
    overflow-x: scroll;
    scrollbar-color: #555555 #011e3a;
  }
  
  #wrapper {
    display: flex;
    flex-direction: row;
    background-color: #00162a;
  }

  </style>
  
  <div id="wrapper">
    <action-button id="addTabButton" secondary="true" color="cobalt">
      +
    </action-button>
  </div>
`;

class TabBar extends HTMLElement {
  constructor() {
    super();
    this._shadow = this.attachShadow({mode: "open"}); // Create a shadow root for this element.
    this._selected = null;
    this._tabs = [];

    this.onAdd = this.onAdd.bind(this);

    const node = wrapperTemplate.content.cloneNode(true); // Clone template node.
    this._container = node.getElementById("wrapper"); // This elements content will be placed here.

    // Set click handlers 
    node.getElementById("addTabButton").onclick = this.onAdd;

    this._shadow.appendChild(node);
  }

  changeActive(target) {
    if (this._selected)
      this._selected.setActive(false);

    this._selected = target;
    target.setActive(true);
  }

  onAdd() {
    const add = new Tab("test", (event) => {
      event.preventDefault();
      this._container.removeChild(add); 
    });
  
    add.onclick = () => {
      this.changeActive(add);
      console.log(add);
    };


    this.changeActive(add);
    
    this._container.appendChild(add);
    this._tabs.concat(add);
  }
}

customElements.define("tab-bar", TabBar);

export default TabBar;