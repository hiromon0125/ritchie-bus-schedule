import _ from "lodash";

self.onmessage = async (event: { data: File }) => {
  const reader = new FileReader();

  reader.onload = function (event) {
    const csv = event.target?.result;
    if (typeof csv !== "string") {
      throw new Error("Error reading the file");
    }
    const lines = csv.split("\n");
    if (lines.length <= 1) throw new Error("CSV file is empty or invalid");
    const data = lines.map((line) => line.split(",").map((v) => v.trim()));
    const headers = data.shift();
    if (!headers) {
      throw new Error("CSV file is empty or invalid");
    }
    self.postMessage(_.zipObject(headers, data));
  };

  reader.readAsText(event.data);
};
