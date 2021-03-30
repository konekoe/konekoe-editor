import { exerciseInit } from "../../src/state/exerciseSlice";
import { setActiveSubmission } from "../../src/state/submissionsSlice";
import { WebSocket, Server } from "mock-socket";
import { TEST_WS_ADDRESS } from "../../constants";
import MockServer from "../utils/mockWsServer";


describe("Opening the editor page", function () {
  describe("Manually set data tests", function(){
    beforeEach(function() {
      cy.visit("/");
    });

    it("Displays a wait screen", function () {
      cy.contains("Just a moment");
    });
  
    describe("displays exercise data after init", function () {
      beforeEach(function() {
        cy.window()
        .its("store")
        .invoke("dispatch", exerciseInit([
          { id: "ex1", submissions: [], title: "Some exercise", points: 1, maxPoints: 1, description: "Do something" },
          { id: "ex2", submissions: [], title: "Some exercise", points: 0, maxPoints: 10, description: "# Works like a charm" }
        ]));  
      });
      
      it("tabs and exercise description are shown", function (){
        cy.contains("1/1 | Some exercise");
        cy.contains("0/10 | Some exercise");
        cy.contains("Do something");
      });
  
      it("without submission data, a default code file is shown", function() {
        cy.contains("No files received");
      });
  
      it("code editor is updated after an active sumbission has been set", function() {
        cy.window()
        .its("store")
        .invoke("dispatch", setActiveSubmission({ 
          exerciseId: "ex1", 
          data: [
            {
              fileId: "file1",
              filename: "test.js",
              data: "console.log('Hello');"
            },
            {
              fileId: "file2",
              filename: "text.txt",
              data: "Just some text"
            }
          ] 
        }));
  
        cy.contains("test.js");
        cy.contains("text.txt");
        cy.contains("console.log('Hello');");      
      });
  
      it("clicking the exercise tabs changes the exercise description and code files", function() {
        cy.window()
        .its("store")
        .invoke("dispatch", setActiveSubmission({ 
          exerciseId: "ex1",
          data: [
            {
              fileId: "file1",
              filename: "test.js",
              data: "console.log('Hello');"
            },
            {
              fileId: "file2",
              filename: "text.txt",
              data: "Just some text"
            }
          ] 
        }));
  
        cy.contains("0/10 | Some exercise").click();
        cy.contains("Works like a charm");
        cy.contains("No files received");      
      });
    });
  });

  describe("Mocked WebSocket tests", function() {
    let server: Server;

    beforeEach(function(){
      cy.visit("/", {
        onBeforeLoad(win) {
          // Create a new mock server and stub Window's WebSocket.
          server = MockServer(TEST_WS_ADDRESS);
          cy.stub(win, "WebSocket", ()=> new WebSocket(TEST_WS_ADDRESS))
        }
      });
    });

    describe("fetches data from the server", function() {
      it("fetches exercises and rerenders", function() {
        cy.contains("Exercise 1: Do something");
        server.close();
        server.stop();
      });
  
      it("fetches first submission from list of received submission ids and rerenders editor component", function() {
        cy.contains("function.ts");
        cy.contains("types.ts");
        server.close();
        server.stop();
      });
    });
  });
});