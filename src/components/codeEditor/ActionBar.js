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
    flex-direction: row-reverse;
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
    <button>
      Run
    </button>  
    <button>
      Change language
    </button>
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
  </nav>
`;

class ActionBar extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({mode: "open"}); // Create a shadow root for this element.
    
    const node = wrapperTemplate.content.cloneNode(true); // Clone template node.
    this.container = node.getElementById("wrapper"); // This elements content will be placed here.
    this.shadow.appendChild(node);
  }
}

customElements.define("action-bar", ActionBar);

export default ActionBar;