import { initializeStockfish } from "./stockfish.js";
import { startServer } from "./server.js";

(async function () {
  await initializeStockfish();
  startServer();
})();
