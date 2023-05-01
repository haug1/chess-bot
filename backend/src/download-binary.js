const { exec } = require("child_process");
const { createWriteStream, existsSync } = require("fs");
const { debug } = require("../src/utils");
const axios = require("axios").default;

const stockfishDownloadBaseUrl = "https://stockfishchess.org/files/";
const stockfishZipFilename = (version, platform) =>
  `stockfish_${version}_${platform}_x64.zip`;

async function downloadStockfish(filename) {
  debug("downloading stockfish..");
  const url = stockfishDownloadBaseUrl + filename;
  const { data } = await axios.get(url, {
    responseType: "stream",
    onDownloadProgress: function (progress) {
      if (progress.estimated) {
        const downloadRateMbps = progress.rate / 1000000 + "mb/s";
        const etaMins =
          progress.estimated > 60
            ? (progress.estimated / 60).toFixed(1) + " mins"
            : progress.estimated + " seconds";
        const currentMbDownloaded =
          (progress.loaded / 1000000).toFixed(2) + "mb";
        const totalMbToDownload = (progress.total / 1000000).toFixed(2) + "mb";
        debug(
          url,
          currentMbDownloaded +
            "/" +
            totalMbToDownload +
            " @ " +
            downloadRateMbps +
            "\n",
          "ETA: " + etaMins + "\n"
        );
      }
    },
  });
  return new Promise(function (resolve, reject) {
    let error = false;
    const writer = createWriteStream(filename);
    data.pipe(writer);
    writer.on("error", function (error) {
      error = true;
      writer.close();
      reject(error);
    });
    writer.on("close", function () {
      if (!error) resolve();
      debug("downloaded " + filename + " successfully");
    });
  });
}

function execCommand(command) {
  return new Promise(function (resolve, reject) {
    const process = exec(command);
    process.on("spawn", function () {
      debug("$ " + command);
    });
    process.stdout.on("data", function (msg) {
      debug(msg);
    });
    process.stderr.on("data", function (msg) {
      debug(msg);
    });
    process.on("close", function (code) {
      if (code != 0) reject(new Error(command + " exited with code " + code));
      else {
        debug(command + " completed with exitCode " + code);
        resolve(code);
      }
    });
  });
}

async function unzipStockfish(filename, outFilePath) {
  const filenameMinusExt = filename.replace(".zip", "");
  await execCommand(
    `unzip -j ${filename} ${filenameMinusExt}/stockfish* -d bin/`
  );
  await execCommand("mv bin/stockfish* " + outFilePath);
}

function deleteZip(filename) {
  return execCommand("rm " + filename);
}

async function getLatestVersion() {
  const releasesResponse = await axios.get(
    "https://api.github.com/repos/official-stockfish/Stockfish/releases"
  );
  return releasesResponse.data[0].name.split(" ")[1];
}

async function downloadStockfishForPlatform() {
  const platform =
    process.platform === "win32"
      ? "win"
      : process.platform === "linux"
      ? "linux"
      : undefined;
  if (!["win", "linux"].includes(platform))
    throw new Error(
      `The specified platform ${platform} is not supported. (win/linux only)`
    );
  const version = await getLatestVersion();
  const filename = stockfishZipFilename(version, platform);
  const suffix = `-${version}-${platform}`;
  const outFilepath = "bin/stockfish" + suffix;
  if (existsSync(outFilepath)) {
    debug(
      "Cancelled download of " + filename + " because it's already installed."
    );
    return outFilepath;
  }
  await downloadStockfish(filename);
  await unzipStockfish(filename, outFilepath);
  await deleteZip(filename);
  return outFilepath;
}

module.exports = { downloadStockfishForPlatform };
