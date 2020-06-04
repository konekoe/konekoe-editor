import "./ActionButton.js";
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

  </style>
  
  <nav id="wrapper">
    <tab-bar id="tabContainer" ></tab-bar>

    <action-button id="runButton" color="cobalt">
      Run
    </action-button>

  </nav>
`;

class ActionBar extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({mode: "open"}); // Create a shadow root for this element.
    
    const node = wrapperTemplate.content.cloneNode(true); // Clone template node.
    this.container = node.getElementById("wrapper"); // This elements content will be placed here.

    // Set click handlers 
    node.getElementById("runButton").onclick = this.onRun;

    this.shadow.appendChild(node);
  }


  onRun() {
    console.log("RUN");
  }


}

customElements.define("action-bar", ActionBar);

export default ActionBar;