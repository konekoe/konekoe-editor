import { MinorError, CriticalError, GenericError, MessageError, assertNever } from "./errors";
import { Store } from "../state/store";
import { RequestMessage, ResponseMessage, ResponsePayload, ServerConnectResponse, RequestPayload, Exercise, RuntimeError, ExerciseFile, FileData } from "../types";
import { push } from "../state/errorSlice";
import { exerciseInit } from "../state/exerciseSlice";
import { submissionInit, resolveSubmission, setActiveSubmission } from "../state/submissionsSlice";
import { isServerConnectResponse, isSubmissionResponse, isTerminalMessage, isSubmissionFetchResponse } from "./typeCheckers";
import { addTerminalOutput } from "../state/terminalSlice";
import { generateUuid } from ".";

class WebSocketMessageHandler {
  private _socket: WebSocket;
  private _token: string;
  private _store: Store;

  constructor(address: string, token: string, store: Store) {

    this._socket = new WebSocket(address);
    this._token = token;

    this._store = store;

    this.open = this.open.bind(this);
    this._sendMessage = this._sendMessage.bind(this);

    this._socket.onmessage = ({ data }: { data: string }) => {
      try {
        const msgObj: ResponseMessage = JSON.parse(data);

        if (!msgObj.type)
          return this._store.dispatch(push(new MinorError("Invalid message received.", "Message Error")));
        
        this._handleMessage(msgObj);
      }
      catch (err) {
        return this._store.dispatch(push(new MessageError("Malformed message data.")));
      }
    };

    document.addEventListener("terminal_write", ({ detail }) => {
      this._sendMessage("terminal_input", detail);
    });

    this._store.subscribe(submissionWatcherFactory(this._store, "activeSubmissions")((newState, oldState) => {
      // Find a submission. The data must have changed and be a non null object.
      const submission = Object.entries(newState).find(sub => sub[1] && !oldState[sub[0]]);

      // Check that a submission was found.
      // This function is triggered when the results of a submission are recorded in which case we don't want to do anything.
      if (submission) {
        this._sendMessage("code_submission", { id: submission[0], files: submission[1] });
      }
      
    }));
  }

  public async open() {
    return new Promise((resolve) => {
      this._socket.addEventListener("open", (event) => {
        this._socket.send(JSON.stringify({ type: "server_connect", payload: { token: this._token } }));
      });
  
      document.addEventListener("server_connect", ({ detail }) => {
        document.removeEventListener("server_connect", this);

        resolve(detail);
      });  
    });
  }

  public async sendMessage(type: string, payload: RequestPayload) {
   this._socket.send(JSON.stringify({ type, payload }))
  }

  private _serverConnectHandler(payload: ResponsePayload, error?: MessageError) {
    if (error) {
      throw new CriticalError(error.message);
    }

    if (!isServerConnectResponse(payload))
      throw new CriticalError("Invalid server response.");

    this._store.dispatch(exerciseInit(payload.exercises)); 
    this._store.dispatch(submissionInit(payload.exercises));
  }

  private _codeSubmissionHandler(payload: ResponsePayload, error?: MessageError) {
    
    // Submissions should resolve even if the server produces an error and possible grader errors be shown to the user.
    if (error) {
      this._store.dispatch(push(error));
    }

    if (!isSubmissionResponse(payload))
      throw new MinorError("Invalid response ", "MessageError");
    
      this._store.dispatch(resolveSubmission(payload));
  }

  private _handleTerminalOutput(payload: ResponsePayload, error?: MessageError) {
    if (error) 
      throw error;

    if (!isTerminalMessage(payload)) {
      console.log("Could not write to terminal.");
      return;
    }

    this._store.dispatch(addTerminalOutput(payload));
  }

  private _handleSubmissionFetch(payload: ResponsePayload, error?: MessageError) {
    if (error) 
      throw error;

    if (!isSubmissionFetchResponse(payload))
      throw new MinorError("Could not fetch submission", "FetchingError");

    this._store.dispatch(setActiveSubmission({
      exerciseId: payload.exercisedId,
      data: payload.files.map((data: FileData): ExerciseFile => ({ fileId: generateUuid("file"), ...data })) 
    }));
  }

  private _handleMessage({ type, payload, error }: ResponseMessage): void {
    try {
      switch (type) {
        case "server_connect":
          this._serverConnectHandler(payload, error);
          break;
        
        case "code_submission":
          this._codeSubmissionHandler(payload, error);
          break;
  
        case "terminal_output":
          this._handleTerminalOutput(payload, error);
          break;

        case "submission_fetch":
          this._handleSubmissionFetch(payload, error);
          break;

        default:
          assertNever(type);
      }
    }
    catch (err) {
      this._store.dispatch(push(err as RuntimeError));
    }

    return;
  }

  
}

export default WebSocketMessageHandler;