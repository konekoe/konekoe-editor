import { WebSocket } from "mock-socket";
import { TEST_WS_ADDRESS } from "../../constants";
import MockServer, { ServerMock } from "../utils/mockWsServer";
import { ResponseMessage } from "../../src/types";


describe("<CodeTerminal />", function () {
  let server: ServerMock;

  beforeEach(function(){
    cy.visit("/", {
      onBeforeLoad(win) {

        if (server) {
          server.stop();
        }

        // Create a new mock server and stub Window's WebSocket.
        server = MockServer(TEST_WS_ADDRESS);
        cy.stub(win, "WebSocket", ()=> new WebSocket(TEST_WS_ADDRESS));
      }
    });
  });

  it("Simple terminal output is shown", function() {
    cy.contains("Exercise 1: Do something");

    // Wrap server in a Cypress promise like object and wait for sendMessage to be defined.
    cy.wrap(server)
    .its("sendMessage")
    .then((send: (msg: ResponseMessage) => void) => {
      send({
        type: "terminal_output",
        payload: {
          exerciseId: "ex1",
          data: "Hello\r\nWorld"
        }
      });
    });
    cy.contains("Hello");
    cy.contains("World");
  });

  it("Terminal data is exercise specific", function() {
    cy.contains("Exercise 1: Do something");

    // Wrap server in a Cypress promise like object and wait for sendMessage to be defined.
    cy.wrap(server)
    .its("sendMessage")
    .then((send: (msg: ResponseMessage) => void) => {
      send({
        type: "terminal_output",
        payload: {
          exerciseId: "ex1",
          data: "Hello\r\nWorld"
        }
      });
    });
    cy.contains("Hello");
    cy.contains("10/100 | Exercise 2: Code").click();
    cy.contains("Hello")
    .should("not.have.a.property", "role");
    cy.contains("Exercise 1: Do something");
    cy.contains("Hello");
  });

  it("Terminal is only written when the targeted exercise is active", function() {
    cy.contains("Exercise 1: Do something");

    // Wrap server in a Cypress promise like object and wait for sendMessage to be defined.
    cy.wrap(server)
    .its("sendMessage")
    .then((send: (msg: ResponseMessage) => void) => {
      send({
        type: "terminal_output",
        payload: {
          exerciseId: "ex2",
          data: "Hello\r\nWorld"
        }
      });
    });
    cy.contains("Hello").should("not.exist");
    cy.contains("10/100 | Exercise 2: Code").click();
    cy.contains("Hello");
  });
});