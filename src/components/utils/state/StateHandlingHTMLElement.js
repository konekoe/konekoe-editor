class StateHandlingHTMLElement extends HTMLElement {
  constructor(state) {
    super();

    this._state = state;

    if (this._state) {
      this._stateSubscriptionHandler = this._stateSubscriptionHandler.bind(this);

      this._state.subscribe(this._stateSubscriptionHandler);
    }
  }

  set state(stateObj) {
    this._state = stateObj;

    this._stateSubscriptionHandler = this._stateSubscriptionHandler.bind(this);
    this._state.subscribe(this._stateSubscriptionHandler)
  }

  get state(){
    return this._state;
  }

  _stateSubscriptionHandler() {

  }

}

export default StateHandlingHTMLElement;

