import "./ActionButton.js";

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
    background-color: #00162a;
  }

  #tab-container {
    display: flex;
    flex-direction: row;
    width: 100%;
  }

  .code_tab {
    display: inline-block;
    padding: 0.5rem;
    border-right: 1px solid #555555;
  }

  .code_tab_active {
    background-color: #002240;
  }

  </style>
  
  <nav id="wrapper">
    <div id="tab-container">
      <span class="code_tab code_tab_active">
        Test.js
      </span>
      <span class="code_tab">
        not_file.txt
      </span>
      <span class="code_tab">
        not_file.txt
      </span>
      <span class="code_tab">
        not_file.txt
      </span>
    </div>

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