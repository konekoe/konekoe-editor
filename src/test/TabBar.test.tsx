import React from "react";
import { render, fireEvent } from "@testing-library/react";
import TabBar from "../components/TabBar/";
import { randInt, generateRandomString } from "./utils";
import { TabProps, PointsProp } from "../types";

const TAB_CLASS_NAME = "MuiTab-root";
const ACTIVE_TAB_CLASS_NAME = "Mui-selected";
const POINTS_CLASS_NAME = "tab-points";

const generateValidPointsObject = (): PointsProp => {
  const maxPoints = randInt(1, 100);

  return {
    maxPoints,
    receivedPoints: randInt(0, maxPoints)
  };
};

const generateValidTabItem = (points = false) => ({
  label: generateRandomString(),
  id: generateRandomString(),
  points: (points) ? generateValidPointsObject() : undefined
});

const generateValidTabItemArray = (length: number) => Array(length).fill(1).map(generateValidTabItem);

describe("<TabBar/>", () => {
  it("correct number of tabs are created", () => {
    Array(100).fill(1)
    .map(() => generateValidTabItemArray(randInt(0, 100)))
    .forEach((tabItems: Omit<TabProps, "clickHandler">[]) => {
      const component = render(<TabBar selectionHandler={ jest.fn() } tabItems={ tabItems }/>);
      expect(component.container.querySelectorAll(`.${ TAB_CLASS_NAME }`)).toHaveLength(tabItems.length);
    });
  });

  it("by default the first tab is active", () => {
    const component = render(<TabBar selectionHandler={ jest.fn() } tabItems={ generateValidTabItemArray(3) }/>);
    
    const tabs = component.container.querySelectorAll(`.${ TAB_CLASS_NAME }`);

    expect(tabs[0]).toHaveClass(ACTIVE_TAB_CLASS_NAME);
  });

  it("the active tab can be changed by clicking a non-active tab", () => {
    const component = render(<TabBar selectionHandler={ jest.fn() } tabItems={ generateValidTabItemArray(3) }/>);

    const tabs = component.container.querySelectorAll(`.${ TAB_CLASS_NAME }`);

    fireEvent.click(tabs[1]);

    expect(tabs[0]).not.toHaveClass(ACTIVE_TAB_CLASS_NAME);
    expect(tabs[1]).toHaveClass(ACTIVE_TAB_CLASS_NAME);

    fireEvent.click(tabs[2]);

    expect(tabs[1]).not.toHaveClass(ACTIVE_TAB_CLASS_NAME);
    expect(tabs[2]).toHaveClass(ACTIVE_TAB_CLASS_NAME);

    fireEvent.click(tabs[0]);

    expect(tabs[2]).not.toHaveClass(ACTIVE_TAB_CLASS_NAME);
    expect(tabs[0]).toHaveClass(ACTIVE_TAB_CLASS_NAME);

    expect(component.container.querySelectorAll(`.${ ACTIVE_TAB_CLASS_NAME }`)).toHaveLength(1);
  });

  it("clicking a non-active tab fires the selection handler", () => {
    const selectionHandler = jest.fn();
    const component = render(<TabBar selectionHandler={ selectionHandler } tabItems={ generateValidTabItemArray(2) }/>);

    fireEvent.click(component.container.querySelectorAll(`.${ TAB_CLASS_NAME }`)[1]);

    expect(selectionHandler.mock.calls).toHaveLength(1);
  });

  it("clicking an active tab does not fire the selection handler", () => {
    const selectionHandler = jest.fn();
    const component = render(<TabBar selectionHandler={ selectionHandler } tabItems={ generateValidTabItemArray(2) }/>);

    const activeTab = component.container.querySelector(`.${ ACTIVE_TAB_CLASS_NAME }`);

    expect(activeTab).not.toBeNull();

    if (!activeTab)
      return;

    fireEvent.click(activeTab);

    expect(selectionHandler.mock.calls).toHaveLength(0);
  });

  describe("tab contents", () => {
    describe("tab label string is required", () => {
      it("if label is not provided, throw an exection", () => {
        // Force undefined to be interpreted as a string by TypeScript.
        const tabItems = [{ ...generateValidTabItem(), label: (undefined as unknown as string) }];

        expect(() => render(<TabBar selectionHandler={ jest.fn() } tabItems={ tabItems } />)).toThrow("Malformed tab data.");
      });
      it("if label is provided, it is rendered", () => {
        const tabItems = [generateValidTabItem()];
        const component = render(<TabBar selectionHandler={ jest.fn() } tabItems={ tabItems } />);

        expect(component.container).toHaveTextContent(tabItems[0].label);
      });
    });

    describe("points are optional", () => {
      it("if points are not provided, only render the label", () => {
        const tabItems = [generateValidTabItem()];
        const component = render(<TabBar selectionHandler={ jest.fn() } tabItems={ tabItems } />);

        expect(component.container).toHaveTextContent(tabItems[0].label);
        expect(component.container.querySelector(`.${ POINTS_CLASS_NAME }`)).toBeNull();
      });

      it("if the points object does not have points and maxPoints fields of type number, throw an exception", () => {
        const tabItems = [{ ...generateValidTabItem(), points: {  } as PointsProp }];
    
        expect(() => render(<TabBar selectionHandler={ jest.fn() } tabItems={ tabItems } />)).toThrow("Malformed tab data.");
      });

      it("if points are provided, render <POINTS>/<MAX_POINTS>", () => {
        const tabItems = [generateValidTabItem(true)];
        const component = render(<TabBar selectionHandler={ jest.fn() } tabItems={ tabItems } />);
 
        expect(component.container).toHaveTextContent(`${ (tabItems[0].points as PointsProp).receivedPoints }/${ (tabItems[0].points as PointsProp).maxPoints } | ${ tabItems[0].label }`);
      });
    });
  });
});