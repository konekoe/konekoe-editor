import React from "react";
import { render, fireEvent } from "@testing-library/react";
import CodeTerminal from "../components/CodeTerminal";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";
import { clearTerminal } from "../state/terminalSlice";

const exerciseId = "some-exercise";
const terminalId = "test-id";


describe("<CodeTerminal/>", () => {
  let store = configureStore()({});

  beforeEach(() => {
    store = configureStore()({
      terminals: {
        output: {
          [exerciseId]: "Hello there"
        },
        input: {} // NOTE: Input handling is not implemented yet.
      }
    });

    store.dispatch = jest.fn();
  });



  it("xterm terminal is attached", () => { 
    const component = render(
    <Provider store={ store }>
      <CodeTerminal exerciseId={ exerciseId }/>
    </Provider>
    );

    expect(component.container.querySelector(".xterm")).not.toBeNull();
  });

  it("clear button sends clear action to state", () => {
    const component = render(
    <Provider store={ store }>
      <CodeTerminal exerciseId={ exerciseId }/>
    </Provider>
    );
    
    const clearButton = component.container.querySelector("[class*=clearButton]");
    
    expect(clearButton).not.toBeNull();

    if (!clearButton)
      return;

    fireEvent.click(clearButton);

    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith(
      clearTerminal({ exerciseId })
    );

  });
});