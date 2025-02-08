self.onmessage = (e) => {
    const { path } = e.data.payload;
    console.log(path);
    // Do something with the path
    self.postMessage({ type: "data", payload: path });
};
export {};
