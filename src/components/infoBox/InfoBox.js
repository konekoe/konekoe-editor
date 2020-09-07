import * as marked from "marked/marked.min.js";
import * as insane from "insane/insane.js";
import HttpMessageHandler from "../../utils/HttpMessageHandler.js";
import ErrorHandlingHTMLElement from "../utils/ErrorHandlingHTMLElement.js";
import { URL_REGEX } from "../../utils/functions.js";

const wrapperTemplate = document.createElement("template");
wrapperTemplate.innerHTML = `
  <style>
  :host{
      display: flex;
      height: 100%;
      flex-direction: column;
  }
  #wrapper{
    flex: 1;
    height: 100%;
    padding: 0.5rem;
    overflow-y: scroll;
    overflow-wrap: break-word;
    scrollbar-color: #555555 #011e3a;
    background-color: #002240;
  }
  </style>
  <article id="wrapper">
    You can write instructions here.
  </article>
`;

class InfoBox extends ErrorHandlingHTMLElement {
  constructor() {
    super();
    super.displayError.bind(this);

    this._shadow = this.attachShadow({mode: "open"}); // Create a shadow root for this element.
    
    const node = wrapperTemplate.content.cloneNode(true); // Clone template node.
    this._container = node.getElementById("wrapper");

    this._shadow.appendChild(node);
  }
  async connectedCallback() {
    let content = this.innerHTML.trim();
    if (this.hasAttribute("content")) {
      try {
        if (URL_REGEX.test(this.getAttribute("content")))
          content = await (new HttpMessageHandler(this.getAttribute("content"))).getMessage("");
        else
          content = this.getAttribute("content");
      }
      catch (err) {
        super.displayError(err); 
      }
    }

    // Parse with marked.
    const unsafeHTML = marked(content);

    // Sanitize with insane.
    const sanitized = insane(unsafeHTML);

    this._container.innerHTML = sanitized;
  }
}

customElements.define("info-box", InfoBox);

export default InfoBox;