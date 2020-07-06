import "./ActionButton.js";

const wrapperTemplate = document.createElement("template");


class Modal extends HTMLElement {

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
          position: ${ (this.hasAttribute("coverScreen") ? "fixed" : "absolute") };
          display: none;
          grid-template-columns: [left] 20% [center-left] 53% [center-right] 34% [right];
          grid-template-rows: [top] 10% [middle-top] 66% [middle-bottom] 33% [bottom];
          left: 0;
          top: 0;
          width: 100vw;
          height: 100vh;
          background-color: #00000050;
          z-index: 100;
          text-align: center;
        }

        #container {
          display: flex;
          flex-direction: column;
          background-color: white;
          grid-column-start: center-left;
          grid-column-end: center-right;
          grid-row-start: middle-top;
          grid-row-end: middle-bottom;
        }

        #content {
          color: black;
          height: 100%;
        }

        #btnWrapper {
          display: flex;
          flex-direction: row;
        }

        #acceptBtn, #cancelBtn {
          width: 100%;
        }

      </style>
      
      <div class="" id="wrapper">

        <div id="container">

          <div  id="content">
            <slot name="content">
            </slot>
          </div>

          <div id="btnWrapper">
            <action-button id="acceptBtn" size="lg" block color="green">
              Accept
            </action-button>

            <action-button id="cancelBtn"  size="lg" block color="red">
              Cancel
            </action-button>
          <div>
        </div>
      </div>
    `;

    this._shadow = this.attachShadow({mode: "open"}); // Create a shadow root for this element.

    this._inputVars = inputVars;
    
    this.close = this.close.bind(this);
    this.show = this.show.bind(this);

    const node = wrapperTemplate.content.cloneNode(true); // Clone template node.
    this._container = node.getElementById("wrapper");

    this._acceptBtn = node.getElementById("acceptBtn"); 
    this._cancelBtn = node.getElementById("cancelBtn");

    this._acceptBtn.onclick = () => {
      this.close();
      this.dispatchEvent(new Event("accept"));
    };

    this._cancelBtn.onclick = () => {
      this.close();
      this.dispatchEvent(new Event("cancel"));
    };

    
    this._shadow.appendChild(node);
  }

  connectedCallback() {
    if (this.hasAttribute("show"))
      this.show();

    ["accept", "cancel"].forEach(term => {
      if (this.hasAttribute(term)) {
        const btnTxt = this.getAttribute(term);
  
        if (btnTxt) {
          this[`_${ term }Btn`].innerHTML = btnTxt;
        }
        else {
          this[`_${ term }Btn`].style.display = "none";
        }
      }
    });
    
  }

  close() {
    this._container.style.display = "none";
  }

  show() {
    this._container.style.display = "grid";
  }

}

customElements.define("pop-up-modal", Modal);

export default Modal;