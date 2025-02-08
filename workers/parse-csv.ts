import type { CSVFilePath, WorkerMessage } from "../workers-types";

self.onmessage = (e: { data: WorkerMessage<CSVFilePath> }) => {
  const { path } = e.data.payload;
  console.log(path);
  // Do something with the path
  self.postMessage({ type: "data", payload: path });
};
