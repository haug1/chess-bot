const {
  startEngine,
  stopEngine,
  evalPosition,
  sendCommand,
  cancelCurrentOperation,
} = require("../src");

(async () => {
  await startEngine();
  process.stdin.on("data", async (data) => {
    const sData = data?.toString().trim().split(" ") || "";
    switch (sData[0]) {
      case "":
        console.log("No command");
        break;
      case "r":
        await startEngine();
        break;
      case "c":
        await cancelCurrentOperation();
        console.log("Stockfish engine current operation was cancelled");
        break;
      case "q":
        await stopEngine();
        console.log("Stockfish engine was stopped");
        break;
      case "q!":
        console.log("bye!");
        process.exit(0);
      case "eval":
        evalPosition(sData[1], (evaluation) => {
          console.log(evaluation);
        });
        break;
      default:
        sendCommand(data);
        break;
    }
  });
})();
