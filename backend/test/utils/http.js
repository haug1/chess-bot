import http from "http";

// Using native node module 'http'

/**
 * HTTP POST function that works for its specific purposes
 * @returns {Promise<string>} raw text response
 */
export const post = (url, data, contentType = undefined) =>
  new Promise((resolve, reject) => {
    const postRequest = http.request(
      url,
      {
        method: "POST",
        headers: {
          ...(contentType && {
            "Content-Type": contentType,
          }),
          ...(data && {
            "Content-Length": data.length,
          }),
        },
        timeout: 5000,
      },
      (res) => {
        if (res.statusCode !== 200) {
          return reject(new Error(`HTTP status code ${res.statusCode}`));
        }
        const data = [];
        res.on("data", (d) => data.push(d));
        res.on("end", () =>
          resolve(data ? Buffer.concat(data).toString() : data)
        );
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
