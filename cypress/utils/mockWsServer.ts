import { Server, WebSocket } from "mock-socket";
import { ServerMessage, ServerConnectRequest, ServerConnectResponse, SubmissionRequest, SubmissionResponse, SubmissionFetchRequest, SubmissionFetchResponse, ServerMessagePayload, Exercise, ExerciseSubmission, ExerciseDictionary, FileData, ExerciseState } from "../../src/types";
import { assertNever } from "../../src/utils/errors";

export interface MockServerMessageHandlers {
  server_connect?: (data: ServerConnectRequest) => ServerConnectResponse;
  code_submission?: (data: SubmissionRequest) => SubmissionResponse;
  submission_fetch?: (data: SubmissionFetchRequest) => SubmissionFetchResponse;
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

const defaultServerConnect = (): ServerConnectResponse => (
  {
    exercises: defaultTestExercises
  }
);

const defaultSubmissionFetchHandler = (request: SubmissionFetchRequest): SubmissionFetchResponse => {
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
    return { ...request, ...(defaultTestSubmissions[request.exercisedId].find((sub: ExerciseSubmission) => sub.id === request.submissionId) || defaultSubmission) }
  }
  
  return { ...request, ...defaultSubmission };
};

// By default, all submissions return 0/0.
// Use MockServer's messageHandlers parameter to utilize more complex logic. 
const defaultSubmissionHandler = (request: SubmissionRequest): SubmissionResponse => {
  return {
    exerciseId: request.exerciseId,
    points: 0,
    maxPoints: 0,
  }
};

export default function MockServer(addr: string, messageHandlers: MockServerMessageHandlers = {}): Server {
  const mockServer = new Server(addr);

  // Mock for the backend.
  mockServer.on("connection", (socket: WebSocket) => {
    const sendMessage = (msg: ServerMessage) => socket.send(JSON.stringify(msg));

    const resolveRequest = (request: ServerMessage): ServerMessagePayload => {
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
      const jsonObj: ServerMessage = JSON.parse(jsonStr);

      sendMessage({ type: jsonObj.type, payload: resolveRequest(jsonObj) });
    });
  });

  return mockServer;
};