import { CriticalError, MinorError, MessageError } from "../../types";

// Singleton for creating serializable error objects.
class ErrorFactory {
  critical(message: string): CriticalError {
    return {
      name: "CriticalError",
      message
    };
  }

  minor(message: string, title: string): MinorError {
    return {
      name: "MinorError",
      message,
      title
    };
  }

  message(message: string, id: string, title?: string): MessageError {
    return {
      name: "MessageError",
      message,
      id,
      title
    };
  }
}

export default new ErrorFactory();