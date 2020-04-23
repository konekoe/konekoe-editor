import * as marked from "marked/marked.min.js";
import * as insane from "insane/insane.js";

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

class InfoBox extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({mode: "open"}); // Create a shadow root for this element.
    
    const node = wrapperTemplate.content.cloneNode(true); // Clone template node.
    this.container = node.getElementById("wrapper");

    // Parse with marked.
    const unsafeHTML = marked(this.innerHTML.trim());

    // Sanitize with insane.
    const sanitized = insane(unsafeHTML);

    this.container.innerHTML = sanitized;
    this.shadow.appendChild(node);
  }
  connectedCallback() {
  }
}

customElements.define("info-box", InfoBox);

export default InfoBox;