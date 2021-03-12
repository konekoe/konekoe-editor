import React from "react";
import { render, fireEvent } from "@testing-library/react";
import ErrorDialog from "../components/ErrorDialog";

describe("<ErrorDialog />", () => {
  it("should display message and title", () => {
    const component = render(<ErrorDialog open={ true } title="Error" message="Hello there" closeHandler={ jest.fn() } />);

    expect(component.getByText("Hello there")).not.toBeNull();
    expect(component.getByText("Error")).not.toBeNull();
  });

  it("should display the number of remaining errors", () => {
    const component = render(<ErrorDialog open={ true } title="Error" message="Hello there" numOfRemainingErrors={ 5 } closeHandler={ jest.fn() } />);

    expect(component.getByText("5")).not.toBeNull();
  });

  it("clicking close should fire the close handler", () => {
    const closeHandler = jest.fn();
    const component = render(<ErrorDialog open={ true } title="Error" message="Hello there" numOfRemainingErrors={ 5 } closeHandler={ closeHandler } />);

    const cancelButton = component.getByText("Close");

    fireEvent.click(cancelButton);

    expect(closeHandler.mock.calls).toHaveLength(1);
  });
});