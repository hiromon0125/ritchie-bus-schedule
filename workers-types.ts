export type WorkerMessage<T> = {
  type: "init" | "data" | "error" | "stop";
  payload: T;
};

export type CSVFilePath = {
  path: string;
};
