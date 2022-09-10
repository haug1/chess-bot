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
      for (const element of document.querySelectorAll(".move .node")) {
        chess.move(element.textContent);
      }

      const response = await askStockfish(chess.fen());

      updateStatusContainer(response, "green", "4px");
      const parsedResponse = translateStockfishResponse(response);
      if (parsedResponse.moves) {
        updateHighlights(parsedResponse.moves);
      }
    } else {
      // opponent's turn
      updateHighlights(undefined, true);
      updateStatusContainer("Waiting..");
    }
  } catch (e) {
    updateStatusContainer("ERROR", "red", "4px");
    throw e;
  } finally {
    move++;
  }
}

const LOOKUP = ["a", "b", "c", "d", "e", "f", "g", "h"];
const createXY = (boardPosition) => ({
  x: LOOKUP.indexOf(boardPosition[0]) + 1,
  y: boardPosition[1],
});
const createMove = (move) => ({
  from: createXY(move.substr(0, 2)),
  to: createXY(move.substr(2)),
});
function translateStockfishResponse(response) {
  let moves;
  if (response.includes("bestmove")) {
    const bestmove = response.substr(9, 4); // i.e. e2e4
    const ponder = response.substr(21); // i.e. e2e4 or empty string
    moves = {
      ...(bestmove && { bestmove: createMove(bestmove) }),
      ...(ponder && { ponder: createMove(ponder) }),
    };
  }
  return {
    moves,
    response,
  };
}

// query the stockfish server for best move based on FEN string
async function askStockfish(fen) {
  const httpResponse = await fetch("http://localhost:8080", {
    method: "POST",
    headers: {
      "Content-Type": "text/plain",
    },
    body: fen,
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

function updateHighlights(positions = undefined, hide = false) {
  if (!highlights.exists()) {
    highlights.createAll();
  }

  if (positions) {
    if (positions.bestmove) {
      highlights.updatePosition(highlights.bestmove, positions.bestmove);
    }
    if (positions.ponder) {
      highlights.updatePosition(highlights.ponder, positions.ponder);
    }
  }

  if (hide) {
    highlights.hideAll();
  } else {
    highlights.showAll();
  }
}

// create and add the status container
function createStatusContainer() {
  const statusContainer = document.createElement("div");
  statusContainer.id = "status-container";
  statusContainer.style.borderWidth = "2px";
  statusContainer.style.borderStyle = "solid";
  statusContainer.style.borderColor = "black";
  statusContainer.style.padding = "5px";

  const botChatContainer = document.querySelector(".play-controller-message");
  if (botChatContainer) {
    botChatContainer.insertBefore(statusContainer, botChatContainer.firstChild);
  } else {
    throw new Error(
      "Failed to create status container, mounting point not found"
    );
  }

  return statusContainer;
}

const PONDER_HIGHLIGHT_COLOR = "rgb(245, 42, 42)"; // red
const BESTMOVE_HIGHLIGHT_COLOR = "rgb(68, 255, 0)"; // green
const BEST_MOVE_ID = "bestmove-highlight";
const PONDER_ID = "ponder-highlight";
const FROM_ID = "-from";
const TO_ID = "-to";

const highlights = {
  bestmove: {
    from: document.querySelector("#" + BEST_MOVE_ID + FROM_ID),
    to: document.querySelector("#" + BEST_MOVE_ID + TO_ID),
  },
  ponder: {
    from: document.querySelector("#" + PONDER_ID + FROM_ID),
    to: document.querySelector("#" + PONDER_ID + TO_ID),
  },
  exists() {
    return !!this.bestmove.from;
  },
  createAll() {
    this.bestmove.from = createHighlight(
      BEST_MOVE_ID + FROM_ID,
      BESTMOVE_HIGHLIGHT_COLOR
    );
    this.bestmove.to = createHighlight(
      BEST_MOVE_ID + TO_ID,
      BESTMOVE_HIGHLIGHT_COLOR
    );
    this.ponder.from = createHighlight(
      PONDER_ID + FROM_ID,
      PONDER_HIGHLIGHT_COLOR
    );
    this.ponder.to = createHighlight(PONDER_ID + TO_ID, PONDER_HIGHLIGHT_COLOR);
  },
  hideAll() {
    this.bestmove.from.style.opacity = "0";
    this.bestmove.to.style.opacity = "0";
    this.ponder.from.style.opacity = "0";
    this.ponder.to.style.opacity = "0";
  },
  showAll() {
    this.bestmove.from.style.opacity = "0.5";
    this.bestmove.to.style.opacity = "0.5";
    this.ponder.from.style.opacity = "0.5";
    this.ponder.to.style.opacity = "0.5";
  },
  updatePosition(highlight, { from, to }) {
    highlight.from.className = `highlight square-${from.x}${from.y}`;
    highlight.to.className = `highlight square-${to.x}${to.y}`;
  },
};

function createHighlight(id, color) {
  const highlight = document.createElement("div");
  highlight.id = id;
  highlight.style.backgroundColor = color;
  highlight.style.opacity = "0.5";

  const board = document.querySelector("chess-board");
  if (board) {
    board.appendChild(highlight);
  } else {
    throw new Error("Board not found");
  }

  return highlight;
}

main();
