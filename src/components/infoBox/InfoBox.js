import * as marked from "marked/marked.min.js"

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
    this.container.innerHTML = marked('# Marked in browser\n\nRendered by **marked**.');
    this.shadow.appendChild(node);
  }
  connectedCallback() {
  }
}

customElements.define("info-box", InfoBox);

export default InfoBox;