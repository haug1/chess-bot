const { downloadStockfishForPlatform } = require("../src/download-binary");

(async function () {
  await downloadStockfishForPlatform(
    process.platform === "win32" ? "win" : "linux"
  );
})();
