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
      statusContainer.update("Figuring out best move..", "yellow");
      const chess = new Chess();
      for (const element of document.querySelectorAll(".move .node"))
        chess.move(element.textContent);

      const stockfishResult = await askStockfish(chess.fen());

      statusContainer.update(stockfishResult.response, "green", "4px");

      if (stockfishResult.moves) highlights.update(stockfishResult.moves);
    } else {
      // opponent's turn
      highlights.update(undefined, true);
      statusContainer.update("Waiting..");
    }
  } catch (e) {
    statusContainer.update("ERROR", "red", "4px");
    throw e;
  } finally {
    move++;
  }
}

// query the stockfish server for best move based on FEN string and parse the result
async function askStockfish(fen) {
  const httpResponse = await fetch("http://localhost:8080", {
    method: "POST",
    headers: {
      "Content-Type": "text/plain",
    },
    body: fen,
  });
  const response = await httpResponse.text();
  let moves;
  if (response.includes("bestmove")) {
    const LOOKUP = ["a", "b", "c", "d", "e", "f", "g", "h"];
    const createXY = (boardPosition) => ({
      x: LOOKUP.indexOf(boardPosition[0]) + 1,
      y: boardPosition[1],
    });
    const createMove = (move) => ({
      from: createXY(move.substr(0, 2)),
      to: createXY(move.substr(2)),
    });
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
    this.bestmove.from = this.createHighlight(
      BEST_MOVE_ID + FROM_ID,
      BESTMOVE_HIGHLIGHT_COLOR
    );
    this.bestmove.to = this.createHighlight(
      BEST_MOVE_ID + TO_ID,
      BESTMOVE_HIGHLIGHT_COLOR
    );
    this.ponder.from = this.createHighlight(
      PONDER_ID + FROM_ID,
      PONDER_HIGHLIGHT_COLOR
    );
    this.ponder.to = this.createHighlight(
      PONDER_ID + TO_ID,
      PONDER_HIGHLIGHT_COLOR
    );
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
  update(positions = undefined, hide = false) {
    if (!this.exists()) {
      this.createAll();
    }

    if (positions) {
      if (positions.bestmove) {
        this.updatePosition(this.bestmove, positions.bestmove);
      }
      if (positions.ponder) {
        this.updatePosition(this.ponder, positions.ponder);
      }
    }

    if (hide) {
      this.hideAll();
    } else {
      this.showAll();
    }
  },
  createHighlight(id, color) {
    const element = document.createElement("div");
    element.id = id;
    element.style.backgroundColor = color;
    element.style.opacity = "0.5";

    const board = document.querySelector("chess-board");
    if (board) {
      board.appendChild(element);
    } else {
      throw new Error("Board not found");
    }

    return element;
  },
};

const STATUS_CONTAINER_ID = "status-container";
const statusContainer = {
  element: document.querySelector("#" + STATUS_CONTAINER_ID),
  exists() {
    return !!this.element;
  },
  update(msg, borderColor = "black", borderWidth = "2px") {
    if (!this.exists()) this.element = this.createStatus();
    this.element.style.borderColor = borderColor;
    this.element.style.borderWidth = borderWidth;
    this.element.innerText = msg;
  },
  createStatus() {
    const element = document.createElement("div");
    element.id = STATUS_CONTAINER_ID;
    element.style.borderWidth = "2px";
    element.style.borderStyle = "solid";
    element.style.borderColor = "black";
    element.style.padding = "5px";

    const container = document.querySelector(".play-controller-message");
    if (container) {
      container.insertBefore(element, container.firstChild);
    } else {
      throw new Error(
        "Failed to create status container, mounting point not found"
      );
    }

    return element;
  },
};

main();
