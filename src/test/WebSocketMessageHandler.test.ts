import { MockServer } from "./utils";
import { WebSocket } from "mock-socket";
import { TEST_WS_ADDRESS } from "../../constants";
import configureStore from "redux-mock-store";
import WebSocketMessageHandler from "../utils/WebSocketMessageHandler";
import { Store } from "../state/store";
import { waitFor } from "@testing-library/dom";
import { exerciseInit, updatePoints } from "../state/exerciseSlice";
import { ServerConnectRequest, Exercise, SubmissionRequest, SubmissionResponse, SubmissionFetchResponse, SubmissionFetchRequest, FileData, TerminalMessage } from "../types";
import { submissionInit, resolveSubmission, setActiveSubmission } from "../state/submissionsSlice";
import { push } from "../state/errorSlice";
import { CriticalError, MessageError, MinorError } from "../utils/errors";
import * as Utils from "../utils";
import { addTerminalOutput } from "../state/terminalSlice";

// NOTE: The token field is always an empty string as authentication is left to the server.
// the editor should not know how the token is used for authentication.

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

        const [server] = MockServer(TEST_WS_ADDRESS, {
          server_connect: (_data: ServerConnectRequest) => ({
            payload: {
              exercises: [testExercise]
            }
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

        const [server] = MockServer(TEST_WS_ADDRESS, {
          server_connect: (_data: ServerConnectRequest) => ({
            payload: {
              exercises: [testExercise]
            }
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
        const [server] = MockServer(TEST_WS_ADDRESS, {
          server_connect: (_data: ServerConnectRequest) => ({
            payload: { exercises: [] },
            error: new MessageError("Server is busted.", "123", "Server Error")
          })
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
      const testRequest: SubmissionRequest = {
        exerciseId: "ex1",
        files: []
      };

      it("successful submission resolves code submission in state and updates exercise points", async function() {
        const testResponse: SubmissionResponse = {
          exerciseId: "ex1",
          points: 0,
          maxPoints: 10
        };

        const [server] = MockServer(TEST_WS_ADDRESS, {
          code_submission: (_data: SubmissionRequest) => ({
            payload: testResponse
          })
        });

        const handler = new WebSocketMessageHandler(TEST_WS_ADDRESS, "", store);

        handler.sendMessage("code_submission", testRequest);

        await waitFor(() => expect(store.dispatch).toHaveBeenCalledTimes(2));

        expect(store.dispatch).toHaveBeenNthCalledWith(1, resolveSubmission(testResponse));
        expect(store.dispatch).toHaveBeenNthCalledWith(2, updatePoints(testResponse));
    
        server.close();
        server.stop();
      });

      it("Incorrect payload produces a MinorError", async function() {
        const testResponse: SubmissionResponse = {
          exerciseId: "ex1",
          points: 0,
        } as SubmissionResponse;

        const [server] = MockServer(TEST_WS_ADDRESS, {
          code_submission: (_data: SubmissionRequest) => ({
            payload: testResponse
          })
        });

        const handler = new WebSocketMessageHandler(TEST_WS_ADDRESS, "", store);

        handler.sendMessage("code_submission", testRequest);

        await waitFor(() => expect(store.dispatch).toHaveBeenCalledTimes(1));

        expect(store.dispatch).toHaveBeenCalledWith(push(new MinorError("Invalid response", "MessageError")));

        server.close();
        server.stop();
      });

      it("server error produces MessageError, but the submission is also resolved", async function() {
        // In other words, even if the server produces an error the editor still resolves the submission request.

        const testResponse: SubmissionResponse = {
          exerciseId: "ex1",
          points: 0,
          maxPoints: 10
        };

        const [server] = MockServer(TEST_WS_ADDRESS, {
          code_submission: (_data: SubmissionRequest) => ({
            payload: testResponse,
            error: new MessageError("Test", "ex1")
          })
        });

        const handler = new WebSocketMessageHandler(TEST_WS_ADDRESS, "", store);

        handler.sendMessage("code_submission", testRequest);

        await waitFor(() => expect(store.dispatch).toHaveBeenCalledTimes(3));

        expect(store.dispatch).toHaveBeenNthCalledWith(1, push(new MessageError("Test", "ex1")));
        expect(store.dispatch).toHaveBeenNthCalledWith(2, resolveSubmission(testResponse));
        expect(store.dispatch).toHaveBeenNthCalledWith(3, updatePoints(testResponse));
    
        server.close();
        server.stop();
      });
    });

    describe("submission_fetch", function() {
      const testRequest = {
        exerciseId: "ex1",
        submissionId: "sub1"
      };

      const testDate = new Date();

      // Mock uuid generation to produce empty strings.
      const mockedUuidGenerate =  jest.spyOn(Utils, "generateUuid");
      mockedUuidGenerate.mockImplementation(() => "");

      const testResponse: SubmissionFetchResponse = {
        ...testRequest,
        date: testDate,
        points: 10,
        files: [
          {
            filename: "file.txt",
            data: "I am Teppo Testaaja. This is my test."
          },
          {
            filename: "readme.md",
            data: "# This is a test"
          }
        ]
      };

      it("successful fetch updates active submission of target exercise", async function() {
        
        const [server] = MockServer(TEST_WS_ADDRESS, {
          submission_fetch: (_data: SubmissionFetchRequest) => ({
            payload: testResponse
          })
        });

        const handler = new WebSocketMessageHandler(TEST_WS_ADDRESS, "", store);

        handler.sendMessage("fetch_submission", testRequest);

        await waitFor(() => expect(store.dispatch).toHaveBeenCalledTimes(1));

        expect(store.dispatch).toHaveBeenNthCalledWith(1, setActiveSubmission({ 
          exerciseId: testRequest.exerciseId,
          data: testResponse.files.map((file: FileData) => ({ ...file, fileId: "" }))
        }));
    
        server.close();
        server.stop();
      });

      it("Incorrect payload produces MinorError", async function() {
        const [server] = MockServer(TEST_WS_ADDRESS, {
          submission_fetch: (_data: SubmissionFetchRequest) => ({
            payload: { ...testResponse, points: undefined, date: undefined } as unknown as SubmissionFetchResponse
          })
        });

        const handler = new WebSocketMessageHandler(TEST_WS_ADDRESS, "", store);

        handler.sendMessage("fetch_submission", testRequest);

        await waitFor(() => expect(store.dispatch).toHaveBeenCalledTimes(1));

        expect(store.dispatch).toHaveBeenCalledWith(push(new MinorError("Could not fetch submission", "FetchingError")));
    
        server.close();
        server.stop();
      });

      it("server error produces a MessageError", async function() {
        const [server] = MockServer(TEST_WS_ADDRESS, {
          submission_fetch: (_data: SubmissionFetchRequest) => ({
            payload: testResponse,
            error: new MessageError("Error fetching", "ex1")
          })
        });

        const handler = new WebSocketMessageHandler(TEST_WS_ADDRESS, "", store);

        handler.sendMessage("fetch_submission", testRequest);

        await waitFor(() => expect(store.dispatch).toHaveBeenCalledTimes(1));

        expect(store.dispatch).toHaveBeenCalledWith(push(new MessageError("Error fetching", "ex1")));
    
        server.close();
        server.stop();
      });
    });

    describe("terminal_output", async function() {
      const testMessage: TerminalMessage = {
        exerciseId: "ex1",
        data: "This is a test"
      };

      it("successful message parsing updates terminal of target exercise", async function() {
        const [server, sendMessage] = MockServer(TEST_WS_ADDRESS, {});

        new WebSocketMessageHandler(TEST_WS_ADDRESS, "", store);

        sendMessage({
          type: "terminal_output",
          payload: testMessage
        });

        await waitFor(() => expect(store.dispatch).toHaveBeenCalledTimes(1));

        expect(store.dispatch).toHaveBeenCalledWith(addTerminalOutput(testMessage));
    
        server.close();
        server.stop();
      });

      it("Incorrect payload produces console.log", async function() {
        const [server, sendMessage] = MockServer(TEST_WS_ADDRESS, {});

        const mockedConsoleLog = jest.spyOn(global.console, "log");

        new WebSocketMessageHandler(TEST_WS_ADDRESS, "", store);

        sendMessage({
          type: "terminal_output",
          payload: testMessage
        });

        await waitFor(() => expect(mockedConsoleLog).toHaveBeenCalledTimes(1));
    
        server.close();
        server.stop();
      });

      it("server error produces a MessageError", async function() {
        const [server, sendMessage] = MockServer(TEST_WS_ADDRESS, {});

        new WebSocketMessageHandler(TEST_WS_ADDRESS, "", store);

        sendMessage({
          type: "terminal_output",
          payload: testMessage,
          error: new MessageError("This is a test.", "123")
        });

        await waitFor(() => expect(store.dispatch).toHaveBeenCalledTimes(1));

        expect(store.dispatch).toHaveBeenCalledWith(push(new MessageError("This is a test.", "123")));
    
        server.close();
        server.stop();
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