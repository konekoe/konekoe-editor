import React from "react";
import { render, fireEvent } from "@testing-library/react";
import ErrorDialog from "../components/ErrorDialog";

describe("<ErrorDialog />", () => {
  it("describe should display message and title", () => {
    const component = render(<ErrorDialog open={ true } title="Error" message="Hello there" closeHandler={ jest.fn() } />);
    
    expect(component.container).toHaveTextContent("Hello there");
    expect(component.container).toHaveTextContent("Error");
  });

  it("should display the number of remaining errors", () => {
    const component = render(<ErrorDialog open={ true } title="Error" message="Hello there" numOfRemainingErrors={ 5 } closeHandler={ jest.fn() } />);

    expect(component.container).toHaveTextContent("5");
  });

  it("clicking close should fire the close handler", () => {
    const closeHandler = jest.fn();
    const component = render(<ErrorDialog open={ true } title="Error" message="Hello there" numOfRemainingErrors={ 5 } closeHandler={ closeHandler } />);

    const cancelButton = component.getByText("Cancel");

    fireEvent.click(cancelButton);

    expect(closeHandler.mock.calls).toHaveLength(1);
  });
});