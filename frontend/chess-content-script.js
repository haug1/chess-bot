// wait for DOM to load (1 sec assumed ok),
// then start observing for moves
function main() {
  setTimeout(() => {
    onMove();
    observeMoves();
  }, 1000);
}

// starts observing the move container element for DOM changes
function observeMoves() {
  console.info("Start observing for moves");
  new MutationObserver(onMove).observe(
    document.querySelector("vertical-move-list"),
    {
      childList: true,
      subtree: true,
    }
  );
}

let move = 0;

// this function is triggered whenever a move happens
//  - scrape all moves if player's turn
//  - translate them to a chess FEN string
//  - ask for stockfish server response
//  - display status for the user
async function onMove() {
  try {
    // only do it on player's turn (todo(?) this is lazy & error-prone)
    if (!(move % 2)) {
      updateStatusContainer("Figuring out best move..", "yellow");
      const chess = new Chess();
      const elements = document.querySelectorAll(".move .node");
      elements.forEach((ele) => chess.move(ele.textContent));
      const response = await askStockfish(chess.fen());
      updateStatusContainer(response, "green", "4px");
    } else {
      updateStatusContainer("Waiting..");
    }
  } catch (e) {
    updateStatusContainer("ERROR", "red", "4px");
    throw e;
  } finally {
    move++;
  }
}

// query the stockfish server for best move based on FEN string
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

// update text of the status container
function updateStatusContainer(
  msg,
  borderColor = "black",
  borderWidth = "2px"
) {
  let statusContainer = document.querySelector("#status-container");

  // create if it doesn't exist
  if (!statusContainer) {
    statusContainer = createStatusContainer();
  }

  statusContainer.style.borderColor = borderColor;
  statusContainer.style.borderWidth = borderWidth;
  statusContainer.innerText = msg;
}

// create and add the status container
function createStatusContainer() {
  const statusContainer = document.createElement("div");
  statusContainer.id = "status-container";
  statusContainer.style.borderWidth = "2px";
  statusContainer.style.borderStyle = "solid";
  statusContainer.style.borderColor = "black";
  statusContainer.style.padding = "5px";

  const botChatContainer = document.querySelector(
    ".play-controller--updated-bot-chat-message"
  );
  if (botChatContainer) {
    botChatContainer.insertBefore(statusContainer, botChatContainer.firstChild);
  } else {
    // TODO: create status container for other game modes
    throw new Error(
      "Failed to create status container, mounting point not found"
    );
  }

  return statusContainer;
}

main();
