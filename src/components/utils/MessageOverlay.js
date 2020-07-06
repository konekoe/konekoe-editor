const wrapperTemplate = document.createElement("template");

class MessageOverlay extends HTMLElement {

  constructor(inputVars = {}) {
    super();

    // Input variables have to be converted to attributes as when the element is created programmatically before
    // the whole application has mounted, the contructor will be called twice.
    for (let key in inputVars) {
      this.setAttribute(key, inputVars[key]);
    }

    wrapperTemplate.innerHTML = `
      <style>
        #wrapper {
          position: ${ this.hasAttribute("coverScreen") ? "fixed" : "absolute" };
          background-color: #00000090; 
          top: 0;
          left: 0;
          width: 100%;
          height: 100%; 
          z-index: 1000;
          text-align: center;
          display: none;
          justify-content: center;
          align-items: center;
        }

      </style>
      
      <div id="wrapper">
        <slot name="content">
        </slot>
      </div>
    `;

    this._shadow = this.attachShadow({mode: "open"}); // Create a shadow root for this element.
    this._timer;

    this.close = this.close.bind(this);
    this.show = this.show.bind(this);

    const node = wrapperTemplate.content.cloneNode(true); // Clone template node.
    this._container = node.getElementById("wrapper");

    this._shadow.appendChild(node);
  }

  connectedCallback() {
    if (this.hasAttribute("show"))
      this.show();
  }

  close() {
    this._container.style.display = "none";
  }

  show() {
    this._container.style.display = "flex";
  }

}

customElements.define("message-overlay", MessageOverlay);

export default MessageOverlay;