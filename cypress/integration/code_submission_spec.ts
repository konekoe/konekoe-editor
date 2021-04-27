import { WebSocket } from "mock-socket";
import { TEST_WS_ADDRESS } from "../../constants";
import MockServer, { ServerMock, ResponseBody } from "../utils/mockWsServer";
import { SubmissionRequest, FileData, SubmissionResponse } from "../../src/types";
import { ErrorFactory } from "../../src/utils/errors";

const testContent1 = "function() { console.log('Hello'); }";
const testContent2 = "export type BooleanType = boolean;";

describe("<CodeEditor />", function () {
  let server: ServerMock;
  
  Cypress.config('defaultCommandTimeout', 60000);

  describe("tabs and editing files", function() {

    beforeEach(function(){
      cy.visit("/", {
        onBeforeLoad(win) {
          // Create a new mock server and stub Window's WebSocket.
          if (server) {
            server.stop();
          }

          server = MockServer(TEST_WS_ADDRESS);
          cy.stub(win, "WebSocket", ()=> new WebSocket(TEST_WS_ADDRESS));
        }
      });
    });

    it("Can switch between file tabs", function() {
      // Content of file received at index 0.
      cy.contains("import");
      cy.wait(100);
      cy.contains("types.ts").click();
      //Content of second file with filename types.ts
      cy.contains("export");
    });

    it("can write to file and edits persist when switching file tabs", function(){
      cy.contains("import");
      cy.wait(100);
      cy.get(".ace_text-input").first().focus().type("This is a test");
      cy.contains("types.ts").click();
      cy.contains("function.ts").click();
      cy.contains("This is a test");
    });
  });

  describe("file submission", function() {
    
    beforeEach(function(){
      cy.visit("/", {
        onBeforeLoad(win) {
          // Create a new mock server and stub Window's WebSocket.
          if (server) {
            server.stop();
          }

          server = MockServer(TEST_WS_ADDRESS, {
            code_submission: (data: SubmissionRequest): ResponseBody<SubmissionResponse> => {
              // Check that 
              const submissionChecker = (fd: FileData): boolean => {
                switch (fd.filename) {
                  case "function.ts":
                    return fd.data.includes(testContent1);
                  case "types.ts":
                    return fd.data.includes(testContent2);
                  default:
                    return false;
                }
              };


              if (data.files.reduce((acc: boolean, fd: FileData) => acc && submissionChecker(fd), true))
                return {
                  payload: {
                    exerciseId: "ex1",
                    points: 10,
                    maxPoints: 10
                  }
                };

              else
                return {
                  payload: {
                    exerciseId: "ex1",
                    points: 0,
                    maxPoints: 0
                  },
                  error: ErrorFactory.message("Test", "ex1", "This is a test") 
                }
            }
          });

          cy.stub(win, "WebSocket", ()=> new WebSocket(TEST_WS_ADDRESS));
        }
      });
    });

    it("successful submit updates points and clears wait screen", function(){
      cy.contains("import"); // Wait until file tabs are ready.
      cy.wait(100);
      cy.get(".ace_text-input").first().focus().type(testContent1, { parseSpecialCharSequences: false });
      cy.contains("types.ts").click();
      cy.get(".ace_text-input").first().focus().type(testContent2, { parseSpecialCharSequences: false });
      
      cy.contains("Submit").click();
      cy.contains("Please wait");
      cy.contains("10/10 | Exercise 1: Do something");
      cy.contains("Please wait").should("not.be.visible");
    });

    it("server side error is displayed and wait screen cleared", function(){
      cy.contains("import"); // Wait until file tabs are ready.
      cy.wait(100);
      cy.contains("Submit").click();
      cy.contains("Please wait");
      cy.contains("This is a test");
      cy.contains("Please wait").should("not.be.visible");
    });
  });
});