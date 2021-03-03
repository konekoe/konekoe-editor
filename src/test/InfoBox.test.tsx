import React from "react";
import { render } from "@testing-library/react";
import InfoBox from "../components/InfoBox";

describe("<InfoBox />", () => {
  describe("should parse markdown to html", () => {
    it("# produces a h1 element", () => {
      const component = render(<InfoBox content="# Test"/>);
      const header = component.container.querySelector("h1");

      expect(header).not.toBeNull();
      expect(header).toHaveTextContent("Test");
    });

    it("markdown list is parsed to an HTML list", () => {
      const content = ["- I am Teppo Testaaja", "- This is a test", "- A list in HTML!"].join("\n");

      const component = render(<InfoBox content={ content }/>);
      const list = component.container.querySelector("ul");

      expect(list).not.toBeNull();

      if (list === null)
        return;

      expect(list.querySelectorAll("li")).toHaveLength(3);
      expect(list.querySelector("li")).toHaveTextContent("I am Teppo Testaaja");
    });
  });

  it("script tags should be removed by sanitization", () => {
    const content = "<script>alert('Vicious code was run!')</script>";

    const component = render(<InfoBox content={ content }/>);

    expect(component.container.querySelector("script")).toBeNull();
  });
});