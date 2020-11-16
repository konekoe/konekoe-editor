import ErrorHandlingHTMLElement from "./state/ErrorHandlingHTMLElement.js";
import { submissionWatcherFactory, maxPointsSelectorFactory } from "./state/submissionsSlice.js";
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
      display: flex;
      flex-direction: row;
      justify-content: space-between;
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

    .codeTabItem {
      display: inline-block;
      flex: 1 1 auto;
      position: relative;
      text-align: center;
    }
    
    .codeTabItem + .codeTabItem {
        padding-left: 0.5rem;
        margin-left: 0.5rem;
        border-left: solid 1px white;
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

// https://www.w3resource.com/javascript-exercises/javascript-math-exercise-23.php
function createUUID(){
  var dt = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (dt + Math.random()*16)%16 | 0;
      dt = Math.floor(dt/16);
      return (c=='x' ? r :(r&0x3|0x8)).toString(16);
  });
  return uuid;
}

class Tab extends ErrorHandlingHTMLElement {

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }


  constructor(options, removeCb, store) {
    super(store);
    this._shadow = this.attachShadow({mode: "open"}); // Create a shadow root for this element.
    this._active = false;
    this._remove = removeCb;
    this._id = options.id || createUUID();
    this._name = options.name || this._id;
    this._points = options.points;
    this._maxPointsSelector = maxPointsSelectorFactory(this._id);

    this.setActive = this.setActive.bind(this);
    this._submissionWatcher = this._submissionWatcher.bind(this);
    
    const node = wrapperTemplate.content.cloneNode(true); // Clone template node.
    this._container = node.getElementById("wrapper");
    this._container.classList.add("codeTab");

    const removeButton = node.querySelector("action-button");

    if (options.noDelete) {
      removeButton.remove();
    }
    else {
      removeButton.onclick = this._remove;
    }

    const nameElement = document.createElement("span");
    nameElement.classList.add("codeTabItem");
    nameElement.innerHTML = this._name;

    node.getElementById("container").appendChild(nameElement);

    if (this._points !== undefined) {
      const pointsElement = document.createElement("span");
      pointsElement.classList.add("codeTabItem");
      pointsElement.innerHTML = this._points;

      node.getElementById("container").appendChild(pointsElement);
      
      submissionWatcherFactory(this._store, "points")(this._submissionWatcher);
    }

    this._shadow.appendChild(node);
  }

  _submissionWatcher(newValue, oldValue) {
    const newPoints = newValue[this._id];
    const oldPoints = oldValue[this._id];

    if (newPoints > oldPoints) {
      this._points = `${ newPoints }/${ this._maxPointsSelector() }`
      pointsElement.innerHTML = this._points;
    }
  }

  setActive(value) {
    this._active = value;
    (value) ? this._container.classList.add("codeTabActive") : this._container.classList.remove("codeTabActive");
  }

}

customElements.define("action-tab", Tab);

export default Tab;