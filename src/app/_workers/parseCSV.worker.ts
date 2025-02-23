const parseCSV = (csv: string): Record<string, string>[] => {
  const lines = csv.split("\n");
  if (lines.length <= 1) throw new Error("CSV file is empty or invalid");
  const headers = lines.shift()!.split(",");
  return lines.map((line) => {
    const row = line.split(",").map((v) => v.trim());
    return headers.reduce(
      (acc, header, index) => {
        acc[header] = row[index] ?? "";
        return acc;
      },
      {} as Record<string, string>,
    );
  });
};

self.addEventListener("message", (event: MessageEvent) => {
  const file = event.data as unknown as File;
  const reader = new FileReader();

  reader.onload = (e) => {
    const csv = e.target?.result as string;
    const parsedData = parseCSV(csv);
    self.postMessage(parsedData);
  };

  reader.readAsText(file);
});

export {}; // This is needed to make TypeScript treat this as a module
