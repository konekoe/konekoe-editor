export interface ErrorState {
  queue: Error[]
}

export interface TerminalState {
  output: Map<string, string[]>;
  input: Map<string, string[]>;
}

export interface TerminalMessage {
  id: string;
  data: string;
}