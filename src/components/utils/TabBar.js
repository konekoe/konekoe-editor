import "./ActionButton.js";
import "./Modal.js";
import Tab from "./Tab.js";
import ErrorHandlingHTMLElement from "./ErrorHandlingHTMLElement.js";

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

  <pop-up-modal>
    <div slot="content">
      <h1>Please give a name for the file</h1>
      <input id="tabNameInput" type="text">
      </input>
    </div>
  </pop-up-modal>
`;

class TabBar extends ErrorHandlingHTMLElement {
  constructor() {
    super();
    this._shadow = this.attachShadow({mode: "open"}); // Create a shadow root for this element.
    this._selected = null;
    this._tabs = [];

    this.onAdd = this.onAdd.bind(this);
    this.createTab = this.createTab.bind(this);
    this.removeAddButton = this.removeAddButton.bind(this);


    const node = wrapperTemplate.content.cloneNode(true); // Clone template node.
    this._container = node.getElementById("wrapper"); // This elements content will be placed here.

    this._addModal = node.querySelector("pop-up-modal");
    this._tabNameInput = node.getElementById("tabNameInput");
    
    // Set event handlers 
    this._addButton = node.getElementById("addTabButton");
    this._addButton.onclick = this.onAdd;

    this._addModal.addEventListener("accept", () => {
      const add = this.createTab(this._tabNameInput.value);

      // bubbles and composed will ensure this can be caught outside of the parent element's shadow DOM.
      const createEvent = new Event("tab-created", { bubbles: true, composed: true });
      createEvent.data = { target: add };
      
      this.dispatchEvent(createEvent);

      this._tabNameInput.value = "";
    });

    this._addModal.addEventListener("cancel", () => {
      this._tabNameInput.value = "";
    });

    this._shadow.appendChild(node);
  }

  changeActive(target) {
    if (this._selected)
      this._selected.setActive(false);

    this._selected = target;
    target.setActive(true);
  }

  createTab(options) {
    const add = new Tab(options, (event) => {
      event.stopPropagation();
      this._container.removeChild(add); 
      
      const removeEvent = new Event("tab-removed", { bubbles: true, composed: true });
      removeEvent.data = { target: add };
      
      this.dispatchEvent(removeEvent);
    });
  
    add.onclick = () => {
      this.changeActive(add);
      // bubbles and composed will ensure this can be caught outside of the parent element's shadow DOM.
      const changeEvent = new Event("tab-changed", { bubbles: true, composed: true });
      changeEvent.data = { target: add };
      
      this.dispatchEvent(changeEvent);
    };

    this.changeActive(add);
      
    this._container.appendChild(add);
    this._tabs.concat(add);


    return add;
  }

  onAdd() {
    this._addModal.show();
  }

  removeAddButton() {
    this._addButton.remove();
  }
}

customElements.define("tab-bar", TabBar);

export default TabBar;