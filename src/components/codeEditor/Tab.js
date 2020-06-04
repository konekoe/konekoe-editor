import "./ActionButton.js";

const wrapperTemplate = document.createElement("template");
wrapperTemplate.innerHTML = `
  <style>
    #wrapper {
      position: relative;
    }
    
    #buttonWrapper {
      position: absolute;
      top: 0;
      right: 0;
      height: 100%;
    }

    .codeTab {
      display: inline-block;
      padding: 0.5rem 1.0rem 0.5rem 0.5rem;
      border: 1px solid transparent;
      border-right: 1px solid #555555;
      cursor: pointer;
    }
  
    .codeTab:hover {
      border: 1px solid #555555;
    }
  
    .codeTabActive {
      background-color: #002240;
    }
  
    .codeTabActive:hover {
      border: 1px solid transparent;
      border-right: 1px solid #555555;
      cursor: default;
    }
  </style>
  
  <div id="wrapper">
    <div id="buttonWrapper">
      <action-button size="sm" slim secondary block color="red">
        X
      </action-button>
    </div>
    <div id="container">
    </div>
  </div>
`;

class Tab extends HTMLElement {

  constructor(name, removeCb) {
    super();
    this._shadow = this.attachShadow({mode: "open"}); // Create a shadow root for this element.
    this._active = false;
    this._remove = removeCb;

    this.setActive = this.setActive.bind(this);

    this.style


    const node = wrapperTemplate.content.cloneNode(true); // Clone template node.
    this._container = node.getElementById("wrapper");
    this._container.classList.add("codeTab");

    node.querySelector("action-button").onclick = this._remove;

    node.getElementById("container").innerHTML = name || this.innerHTML;

    this._shadow.appendChild(node);
  }

  setActive(value) {
    this._active = value;
    (value) ? this._container.classList.add("codeTabActive") : this._container.classList.remove("codeTabActive");
  }

}

customElements.define("action-tab", Tab);

export default Tab;