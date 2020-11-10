class StateHandlingHTMLElement extends HTMLElement {
  constructor(state) {
    super();

    this._store = state;

    if (this._store) {
      this._storeSubscriptionHandler = this._storeSubscriptionHandler.bind(this);

      this._store.subscribe(this._storeSubscriptionHandler);
    }
  }

  set state(stateObj) {
    this._store = stateObj;

    this._storeSubscriptionHandler = this._storeSubscriptionHandler.bind(this);
    this._store.subscribe(this._storeSubscriptionHandler)
  }

  get state(){
    return this._store;
  }

  _storeSubscriptionHandler() {

  }

}

export default StateHandlingHTMLElement;

