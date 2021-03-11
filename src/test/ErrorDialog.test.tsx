import React from "react";
import { render, fireEvent } from "@testing-library/react";
import ErrorDialog from "../components/ErrorDialog";

describe("<ErrorDialog />", () => {
  it("Should display given error message", () => {
    const component = render(<ErrorDialog message="Hello there" closeHandler={ jest.fn() } />);
    
    expect(component.container).toHaveTextContent("Hello there");
  });

  it("should display the number of remaining errors", () => {
    const component = render(<ErrorDialog message="Hello there" numOfRemainingErrors={ 5 } closeHandler={ jest.fn() } />);

    expect(component.container).toHaveTextContent("5");
  });

  it("clicking close should fire the close handler", () => {
    const closeHandler = jest.fn();
    const component = render(<ErrorDialog message="Hello there" numOfRemainingErrors={ 5 } closeHandler={ closeHandler } />);

    const cancelButton = component.getByText("Cancel");

    fireEvent.click(cancelButton);

    expect(closeHandler.mock.calls).toHaveLength(1);
  });
});