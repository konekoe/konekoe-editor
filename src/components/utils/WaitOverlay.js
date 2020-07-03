import ErrorHandlingHTMLElement from "./ErrorHandlingHTMLElement.js";

const wrapperTemplate = document.createElement("template");
wrapperTemplate.innerHTML = `
  <style>
    #wrapper {
      position: absolute;
      background-color: #00000090; 
      top: 0;
      left: 0;
      width: 100%;
      height: 100%; 
      z-index: 200;
      text-align: center;
      display: none;
      justify-content: center;
      align-items: center;
    }

  </style>
  
  <div id="wrapper">
    <h1 id="spinner">
    </h1>
  </div>
`;


class WaitOverlay extends ErrorHandlingHTMLElement {

  constructor() {
    super();
    this._shadow = this.attachShadow({mode: "open"}); // Create a shadow root for this element.
    this._timer;

    this.close = this.close.bind(this);
    this.show = this.show.bind(this);
    this.animateSpinner = this.animateSpinner.bind(this);

    const node = wrapperTemplate.content.cloneNode(true); // Clone template node.
    this._container = node.getElementById("wrapper");
    this._spinner = node.getElementById("spinner");
    
    this._shadow.appendChild(node);
  }

  animateSpinner() {
    // TODO: Allow users to pass their own spinner functions/elements
    // 
    this._spinner.innerHTML = Array((this._spinner.innerHTML.trim().length + 1) % 4)
    .fill(".")
    .join("");
  }

  close() {
    this._timer = clearInterval(this._timer);
    this._spinner.innerHTML = "";

    this._container.style.display = "none";
  }

  show() {
    this._container.style.display = "flex";
    this._timer = setInterval(this.animateSpinner, 700);
  }

}

customElements.define("wait-overlay", WaitOverlay);

export default WaitOverlay;