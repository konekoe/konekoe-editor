import { MockServer } from "./utils";
import { WebSocket } from "mock-socket";
import { TEST_WS_ADDRESS } from "../../constants";
import configureStore from "redux-mock-store";
import WebSocketMessageHandler from "../utils/WebSocketMessageHandler";
import { Store } from "../state/store";
import { waitFor } from "@testing-library/dom";
import { exerciseInit } from "../state/exerciseSlice";
import { ServerConnectRequest, Exercise } from "../types";
import { submissionInit } from "../state/submissionsSlice";
import { push } from "../state/errorSlice";
import { CriticalError, MessageError } from "../utils/errors";

describe("WebSocketMessageHandler", function() {
  describe("Received messages are parsed and store is updated.", function() {
    let store: Store = configureStore()({}) as Store;

    beforeEach(function () {
      // For these tests the store can be empty.
      // The important part is to reset the dispatch function.
      store = configureStore()({}) as Store;

      store.dispatch = jest.fn();
    });

    describe("server_connect and open", function() {
      it("succesful connect updates exercise store and submissions store", async function(){
        const testExercise: Exercise = {
          id: "ex1",
          points: 1,
          maxPoints: 10,
          submissions: ["someSubmission"],
          title: "Some Exercise",
          description: "This is a test"
        };

        const server = MockServer(TEST_WS_ADDRESS, {
          server_connect: (_data: ServerConnectRequest) => ({
            exercises: [testExercise]
          })
        });

        const handler = new WebSocketMessageHandler(TEST_WS_ADDRESS, "", store);

        handler.open();

        await waitFor(() => expect(store.dispatch).toHaveBeenCalledTimes(2));

        expect(store.dispatch).toHaveBeenNthCalledWith(1, exerciseInit([testExercise]));
        expect(store.dispatch).toHaveBeenNthCalledWith(2, submissionInit([testExercise]));
    
        server.close();
        server.stop();
      });

      it("malformed payload produces a CriticalError", async function() {
        // Force malformed data to be recognized by TypeScript.
        const testExercise: Exercise = {
          id: "ex1",
          points: 1,
        } as Exercise;

        const server = MockServer(TEST_WS_ADDRESS, {
          server_connect: (_data: ServerConnectRequest) => ({
            exercises: [testExercise]
          })
        });

        const handler = new WebSocketMessageHandler(TEST_WS_ADDRESS, "", store);

        handler.open();

        await waitFor(() => expect(store.dispatch).toHaveBeenCalledTimes(1));

        expect(store.dispatch).toHaveBeenCalledWith(push(new CriticalError("Invalid server response")));

        server.close();
        server.stop();
      });

      it("server error produces a CriticalError", async function() {
        const server = MockServer(TEST_WS_ADDRESS, {
          server_connect: (_data: ServerConnectRequest) => {
            throw new MessageError("Server is busted.", "123", "Server Error");
          }
        });

        const handler = new WebSocketMessageHandler(TEST_WS_ADDRESS, "", store);

        handler.open();

        await waitFor(() => expect(store.dispatch).toHaveBeenCalledTimes(1));

        expect(store.dispatch).toHaveBeenCalledWith(push(new CriticalError("Server is busted.")));

        server.close();
        server.stop();
      });
    });

    describe("code_submission", function() {
      it("successful submission resolves code submission in state and updates exercise points", function() {

      });

      it("Incorrect payload produces a MinorError", function() {

      });

      it("server error produces MessageError, but the submission is also resolved", function() {
        // In other words, even if the server produces an error the editor still resolves the submission request.
      });
    });

    describe("submission_fetch", function() {
      it("successful fetch updates active submission of target exercise", function() {

      });

      it("Incorrect payload produces MinorError", function() {

      });

      it("server error produces a MessageError", function() {

      });
    });

    describe("terminal_output", function() {
      it("successful message parsing updates terminal of target exercise", function() {

      });

      it("Incorrect payload produces console.log", function() {

      });

      it("server error produces a MessageError", function() {

      });
    });
  });

  describe("Receiving random data produces an error", function(){
    it("random JSON data and completely random data are handeled identically", function() {

    });

    it("random data on open produces a CriticalError", function() {

    });

    it("random data after a successful open call produces a MinorError", function() {

    });
  });

  describe("message handler watches for state updates", function() {
    it("if the state contains a submission request, send a code_submission", function() {

    });

    it("if state contains a submission fetch request, send a submission_fetch", function() {

    });
  });
});