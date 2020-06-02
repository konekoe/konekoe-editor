const wrapperTemplate = document.createElement("template");
wrapperTemplate.innerHTML = `
  <style>
    button {
      display: inline-block;
      border: none;
      margin: 0;
      text-decoration: none;
      color: #ffffff;
      font-family: sans-serif;
      cursor: pointer;
      text-align: center;
      transition: background 250ms ease-in-out, 
                  transform 150ms ease;
      -webkit-appearance: none;
      -moz-appearance: none;
    }

    button::-moz-focus-inner {
      border: 0;
    }

    button:active {
        outline: 1px solid #fff;
        outline-offset: -4px;
    }

    button:active {
        transform: scale(0.99);
    }
  </style>
  
  <button id="wrapper">
  </button>
`;


/* Inputs:
    color     - determines the background color of the button.
    size      - determines font size. - sm, md, lg, big, huge
    block     - if true the button will take up all space available to it.
*/
Number.prototype.clamp = function(min, max) {
  return Math.min(Math.max(this, min), max);
};

const sizeStyling = (sizeStr) => {
  const options = {
    sm: 0.5,
    md: 0.7,
    lg: 1.0,
    big: 1.5,
    huge: 2.0
  };

  const fontSize = options[sizeStr] || options["md"];

  return `
  font-size: ${ fontSize }rem;
  padding: ${ fontSize }rem ${ 1.2*fontSize }rem;
  `;
};

function rgbToHex(color) {
  return (color) ? "#" + ((1 << 24) + (color.r << 16) + (color.g << 8) + color.b).toString(16).slice(1) : "";
};

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

function darkenRgb(color) {
  if (color) {
    color.r = Math.round((color.r * 0.5).clamp(0, 255));
    color.g = Math.round((color.g * 0.5).clamp(0, 255));
    color.b = Math.round((color.b * 0.5).clamp(0, 255));
  }
  
  return color;
};

const colorStyling = (value, darken = false) => {
  // Add style related colors here
  const options = {
    red: "#db2828",
    orange: "#f2711c",
    yellow: "#fbbd08",
    green: "#b5cc18",
    blue: "#2185d0",
    grey: "#767676",
    black: "#000000",
    white: "#ffffff",
    cobalt: "#004480",
    default: ""
  };

  let result = options[value] || options.grey;

  if (darken)
    result = rgbToHex(darkenRgb(hexToRgb(result))); 

  return `
  background-color: ${ result };
  `;
};

const blockStyling = (block) => (block) ? `
  height: 100%;
  width: 100%;
  ` : "";


class ActionButton extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({mode: "open"}); // Create a shadow root for this element.
    
    const node = wrapperTemplate.content.cloneNode(true); // Clone template node.
    this.container = node.getElementById("wrapper"); // This elements content will be placed here.

    const style = document.createElement("style");

    style.innerHTML = `
      ${
        (this.getAttribute("block")) ? 
        `:host{
          height: 100%;
          width: 100%;    
        }
        `
        : ""
      }

      button {
        ${ sizeStyling(this.getAttribute("size")) }
        ${ colorStyling(this.getAttribute("color")) }
        ${ blockStyling(this.getAttribute("block")) }
      }

      button:hover {
        ${ colorStyling(this.getAttribute("color"), true) }
      }
    `;
    this.container.innerHTML = this.innerHTML;

    this.shadow.appendChild(style);
    this.shadow.appendChild(node);
  }
}

customElements.define("action-button", ActionButton);

export default ActionButton;