import { Server, WebSocket } from "mock-socket";
import { RequestMessage, ServerConnectRequest, ServerConnectResponse, SubmissionRequest, SubmissionResponse, SubmissionFetchRequest, SubmissionFetchResponse, Exercise, ExerciseSubmission, ExerciseDictionary, FileData, ExerciseState, ResponseMessage, ResponsePayload, RuntimeError } from "../../src/types";
import { assertNever, MessageError } from "../../src/utils/errors";

export type ResponseBody<A> = { payload: A, error?: MessageError }

export interface MockServerMessageHandlers {
  server_connect?: (data: ServerConnectRequest) => ResponseBody<ServerConnectResponse>;
  code_submission?: (data: SubmissionRequest) => ResponseBody<SubmissionResponse>;
  submission_fetch?: (data: SubmissionFetchRequest) => ResponseBody<SubmissionFetchResponse>;
}

const defaultTestExercises: Exercise[] = [
  {
    id: "ex1",
    points: 0,
    maxPoints: 1,
    submissions: [""],
    title: "Exercise 1: Do something",
    description: "# In this exercise you're supposed to do something\n> Figure it out!"
  },
  {
    id: "ex2",
    points: 10,
    maxPoints: 100,
    submissions: ["submission1", "submission2"],
    title: "Exercise 2: Code",
    description: "# Exercise 2\n Write a function that reverses the given string input\n"
  }
];

const defaultTestSubmissions: ExerciseDictionary<ExerciseSubmission[]> = {
  "ex2": [
    {
      id: "submission1",
      date: new Date(),
      points: 10,
      files: [{
        filename: "source.c",
        data: "int main(){}"
      }]
    },
    {
      id: "submission2",
      date: new Date(),
      points: 0,
      files: [{
        filename: "source.c",
        data: "int main(){ while(true){ } }"
      }]
    }
  ]
};

const defaultServerConnect = (): ResponseBody<ServerConnectResponse> => (
  {
    payload: {
      exercises: defaultTestExercises
    }
  }
);

const defaultSubmissionFetchHandler = (request: SubmissionFetchRequest): ResponseBody<SubmissionFetchResponse> => {
  const defaultSubmission: ExerciseSubmission = {
    id: "submission1",
    date: new Date(),
    points: 0,
    files: [
      {
        filename: "function.ts",
        data: "import { Result } from './types' \n\nexport default function(): Result { \n Write something here \n }"
      },
      {
        filename: "types.ts",
        data: "export interface Result {\nid: string;\nvalue: number;\n}"
      }
    ]
  };

  if (defaultTestSubmissions[request.exercisedId] && defaultTestSubmissions[request.exercisedId].length) {
    return {
      payload: { ...request, ...(defaultTestSubmissions[request.exercisedId].find((sub: ExerciseSubmission) => sub.id === request.submissionId) || defaultSubmission) }
    };
  }
  
  return {
    payload: { ...request, ...defaultSubmission }
  };
};

// By default, all submissions return 0/0.
// Use MockServer's messageHandlers parameter to utilize more complex logic. 
const defaultSubmissionHandler = (request: SubmissionRequest): ResponseBody<SubmissionResponse> => {
  return {
    payload: {
      exerciseId: request.exerciseId,
      points: 0,
      maxPoints: 0,
    }
  };
};

export default function MockServer(addr: string, messageHandlers: MockServerMessageHandlers = {}): Server {
  const mockServer = new Server(addr);

  // Mock for the backend.
  mockServer.on("connection", (socket: WebSocket) => {
    const sendMessage = (msg: ResponseMessage) => socket.send(JSON.stringify(msg));

    const resolveRequest = (request: RequestMessage): ResponseBody<ResponsePayload> => {
      switch (request.type) {
        case "server_connect":
          // Use given handler or defaul handler.
          if (messageHandlers.server_connect)
            return messageHandlers.server_connect(request.payload as ServerConnectRequest);

          return defaultServerConnect();

        case "code_submission":
          // Use given handler or defaul handler.
          if (messageHandlers.code_submission)
            return messageHandlers.code_submission(request.payload as SubmissionRequest);

          return defaultSubmissionHandler(request.payload as SubmissionRequest);

        case "submission_fetch":
          // Use given handler or defaul handler.
          if (messageHandlers.submission_fetch)
            return messageHandlers.submission_fetch(request.payload as SubmissionFetchRequest);
          return defaultSubmissionFetchHandler(request.payload as SubmissionFetchRequest);

        default:
          assertNever(request.type);
      }
    };

    socket.on("message", (jsonStr: string) => {
      const jsonObj: RequestMessage = JSON.parse(jsonStr);

      sendMessage({ type: jsonObj.type, ...resolveRequest(jsonObj) });
    });
  });

  return mockServer;
};