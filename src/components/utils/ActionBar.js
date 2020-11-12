import ErrorHandlingHTMLElement from "./state/ErrorHandlingHTMLElement.js";
import "./TabBar.js";

const wrapperTemplate = document.createElement("template");
wrapperTemplate.innerHTML = `
  <style>
  :host{
    display: flex;
    flex-direction: column;
    min-height: 2rem;
  }
  
  #wrapper {
    display: flex;
    flex-direction: row;
    background-color: #011e3a;
  }

  #tabContainer {
    width: 100%;
  }

  #wrapper {
    scrollbar-color: #555555 #011e3a;
  }

  #wrapper ::-webkit-scrollbar {
    background-color: #011e3a;
  }

  #wrapper ::-webkit-scrollbar-thumb {
    background: #555555; 
  }

  </style>
  
  <nav id="wrapper">
    <tab-bar id="tabContainer" ></tab-bar>
    <slot name="content">
    </slot>
  </nav>
`;

class ActionBar extends ErrorHandlingHTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({mode: "open"}); // Create a shadow root for this element.
    
    const node = wrapperTemplate.content.cloneNode(true); // Clone template node.
    this._tabContainer = node.getElementById("tabContainer");
    this._container = node.getElementById("wrapper"); // This elements content will be placed here.

    this.shadow.appendChild(node);
  }

  get tabContainer() {
    return this._tabContainer;
  }

  connectedCallback() {
    if (this.hasAttribute("noAdd"))
      this._tabContainer.removeAddButton();
  }


}

customElements.define("action-bar", ActionBar);

export default ActionBar;