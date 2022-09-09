import http from "http";

// naive HTTP post function that works as intended for its purposes
export const post = (host, data) =>
  new Promise((resolve, reject) => {
    const postRequest = http.request(
      host,
      {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
          "Content-Length": data.length,
        },
        timeout: 5000,
      },
      (res) => {
        if (res.statusCode !== 200) {
          return reject(new Error(`HTTP status code ${res.statusCode}`));
        }
        const data = [];
        res.on("data", (d) => data.push(d));
        res.on("end", () => resolve(Buffer.concat(data).toString()));
      }
    );
    postRequest.on("error", (err) => reject(err));
    postRequest.on("timeout", () => {
      postRequest.destroy();
      reject(new Error("Request timed out"));
    });
    postRequest.write(data);
    postRequest.end();
  });
