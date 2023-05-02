function debug(...params) {
  if (process.env.DEBUG) {
    console.debug(...params);
  }
}

const fs = require("fs");
const unzip = require("unzip-stream");

/**
 * @param {NodeJS.ReadableStream} readStream
 * @param {string} outputPath
 * @param {RegExp} fileRegex
 * @returns {Promise<void>}
 */
function unzipArchive(readStream, outputPath, fileRegex = /.*/) {
  return new Promise((resolve, reject) => {
    readStream.on("error", reject);
    readStream.pipe(unzip.Parse()).on("entry", function (entry) {
      if (fileRegex.test(entry.path)) {
        const writeStream = fs.createWriteStream(outputPath);
        writeStream.on("finish", resolve);
        writeStream.on("error", reject);
        entry.pipe(writeStream);
      } else {
        entry.autodrain();
      }
    });
  });
}

function isWindows() {
  return process.platform === "win32";
}

function isLinux() {
  return process.platform === "linux";
}

module.exports = {
  debug,
  isLinux,
  isWindows,
  unzipArchive,
};
