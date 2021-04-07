import React from "react";
import { render, fireEvent } from "@testing-library/react";
import CodeEditor from "../components/CodeEditor/";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";
import { submit } from "../state/submissionsSlice";

const exerciseId1 = "some-exercise1";
const exerciseId2 = "some-exercise2";

const fileId1 = "file1";
const fileId2 = "file2";
const fileId3 = "file3";

const TAB_CLASS_NAME = "MuiTab-root";

describe("<CodeEditor />", () => {
  let store = configureStore()({});

  beforeEach(() => {
    store = configureStore()({
      submissions: {
        allSubmissions: [], // TODO: Add suport for fetching different submissions
        submissionRequests: {},
        submissionFetchRequests: {},
        activeSubmissions: {
          [exerciseId1]: {
            [fileId1]: {
              fileId: fileId1,
              filename: "main.c",
              data: "some code here"
            },
            [fileId2]: {
              fileId: fileId2,
              filename: "main.h",
              data: "function prototypes here"
            }
          },
          [exerciseId2]: {
            [fileId3]: {
              fileId: fileId3,
              filename: "answers",
              data: "your answers here."
            }
          }
        },
        points: {
          [exerciseId1]: 0,
          [exerciseId2]: 10
        },
        maxPoints: {
          [exerciseId1]: 10,
          [exerciseId2]: 20
        }
      }
    });

    store.dispatch = jest.fn();
  });

  it("creates correct number of tabs", () => {
    const component = render(
      <Provider store={ store }>
        <CodeEditor exerciseId={ exerciseId1 }/>
      </Provider>
    );

    expect(component.container.querySelectorAll(`.${ TAB_CLASS_NAME }`)).toHaveLength(2);

    component.rerender(
      <Provider store={ store }>
        <CodeEditor exerciseId={ exerciseId2 }/>
      </Provider>
    );
    expect(component.container.querySelectorAll(`.${ TAB_CLASS_NAME }`)).toHaveLength(1);
  });

  it("ace editor is attached", () => {
    const component = render(
      <Provider store={ store }>
        <CodeEditor exerciseId={ exerciseId1 }/>
      </Provider>
    );
    

    expect(component.container.querySelector(".ace_editor")).not.toBeNull();
  });

  it("ace editor is attached with empty store", () => {
    store = configureStore()({
      submissions: {
        allSubmissions: {},
        submissionRequests: {},
        submissionFetchRequests: {
          "some-exercise1": "req" // Submission fetching creates an infinite loop when the state doesn't actually update
        },
        activeSubmissions: {},
        points: {},
        maxPoints: {}
      }
    });

    const component = render(
      <Provider store={ store }>
        <CodeEditor exerciseId={ exerciseId1 }/>
      </Provider>
    );
    

    expect(component.container.querySelector(".ace_editor")).not.toBeNull();
  });

  describe("code can be submitted", () => {
    it("clicking the submission button sends a code submission action", () => {
      const component = render(
        <Provider store={ store }>
          <CodeEditor exerciseId={ exerciseId1 }/>
        </Provider>
      );

      const submissionButton = component.container.querySelector(".submit-button");
      
      expect(submissionButton).not.toBeNull();

      if (!submissionButton)
        return;

      fireEvent.click(submissionButton);

      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(
        submit({
          exerciseId: exerciseId1,
          files:[
            {
              filename: "main.c",
              data: "some code here"
            },
            {
              filename: "main.h",
              data: "function prototypes here"
            }
          ]
        })
      );
    });

    it("when a code submission is being processed, a message overlay is shown", () => {
      const component = render(
        <Provider store={ store }>
          <CodeEditor exerciseId={ exerciseId1 }/>
        </Provider>
      );

      const submissionButton = component.container.querySelector(".submit-button");
      
      expect(submissionButton).not.toBeNull();

      if (!submissionButton)
        return;

      fireEvent.click(submissionButton);

      expect(component.getByText("Please wait")).not.toBeNull();
    });

    it("when a code submission is being processed, another submission can't be sent", () => {
      store = configureStore()({
        submissions: {
          allSubmissions: [], // TODO: Add suport for fetching different submissions
          submissionFetchRequests: {},
          submissionRequests: {
            [exerciseId1]: {
              [fileId1]: "",
              [fileId2]: ""
            }
          },
          activeSubmissions: {
            [exerciseId1]: {
              [fileId1]: {
                fileId: fileId1,
                filename: "main.c",
                data: "some code here"
              },
              [fileId2]: {
                fileId: fileId2,
                filename: "main.h",
                data: "function prototypes here"
              }
            },
            [exerciseId2]: {
              [fileId3]: {
                fileId: fileId3,
                filename: "answers",
                data: "your answers here."
              }
            }
          },
          points: {
            [exerciseId1]: 0,
            [exerciseId2]: 10
          },
          maxPoints: {
            [exerciseId1]: 10,
            [exerciseId2]: 20
          }
        }
      });

      store.dispatch = jest.fn();

      const component = render(
        <Provider store={ store }>
          <CodeEditor exerciseId={ exerciseId1 }/>
        </Provider>
      );

      const submissionButton = component.container.querySelector(".submit-button");
      
      expect(submissionButton).not.toBeNull();

      if (!submissionButton)
        return;

      fireEvent.click(submissionButton);

      expect(store.dispatch).toHaveBeenCalledTimes(0);
    });
  });

});