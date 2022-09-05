// wait for DOM to load, then start observing for moves
function main() {
  setTimeout(() => {
    onMove();
    observeMoves();
  }, 1000);
}

// observes the move container element for DOM changes
function observeMoves() {
  console.log("start observing for moves");
  new MutationObserver(onMove).observe(
    document.querySelector("vertical-move-list"),
    {
      childList: true,
      subtree: true,
    }
  );
}

let move = 0;

// scrape the moves, translates them to a FEN string and get stockfish response
async function onMove() {
  // only do it on player's turn (lazy & error-prone)
  if (!(move % 2)) {
    const chess = new Chess();
    const elements = document.querySelectorAll(".move .node");
    elements.forEach((ele) => chess.move(ele.textContent));
    const response = await askStockfish(chess.fen());
    updateBestMoveContainer(response);
  }
  move++;
}

// queries the stockfish server for best move based on FEN string
async function askStockfish(fen) {
  const httpResponse = await fetch("http://localhost:8080", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fen }),
  });
  return httpResponse.text();
}

// displays the stockfish response text in a container on the page
function updateBestMoveContainer(msg) {
  let bestMoveContainer = document.querySelector(".best-move-container");

  // create if it doesn't exist
  if (!bestMoveContainer) {
    bestMoveContainer = document.createElement("div");
    bestMoveContainer.className = "best-move-container";
    document
      .querySelector(".play-controller--updated-bot-chat-message")
      .appendChild(bestMoveContainer);
  }

  bestMoveContainer.innerText = msg;
}

main();
