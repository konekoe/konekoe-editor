import React from "react";
import { render, fireEvent } from "@testing-library/react";
import ErrorDialog from "../components/ErrorDialog";
import { ErrorFactory } from "../utils/errors";

describe("<ErrorDialog />", () => {
  it("should display message and title", () => {
    const component = render(<ErrorDialog error={ ErrorFactory.minor("Hello there", "Error") } closeHandler={ jest.fn() } />);

    expect(component.getByText("Hello there")).not.toBeNull();
    expect(component.getByText("Error")).not.toBeNull();
  });

  it("should display the number of remaining errors", () => {
    const component = render(<ErrorDialog error={ ErrorFactory.minor("Hello there", "Error") } numOfRemainingErrors={ 5 } closeHandler={ jest.fn() } />);

    expect(component.getByText("5")).not.toBeNull();
  });

  it("clicking close should fire the close handler", () => {
    const closeHandler = jest.fn();
    const component = render(<ErrorDialog error={ ErrorFactory.minor("Hello there", "Error") } numOfRemainingErrors={ 5 } closeHandler={ closeHandler } />);

    const cancelButton = component.getByText("Show next error");

    fireEvent.click(cancelButton);

    expect(closeHandler.mock.calls).toHaveLength(1);
  });
});