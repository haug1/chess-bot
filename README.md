# chess-bot

Provides stockfish best move analysis during gameplay on `chess.com` with Firefox browser

# info

Has 2 components:

## firefox extension (frontend)

- asks the stockfish server based on the FEN string of the current game state whenever a move happens
- displays the stockfish response on the web page
- only runs on `https://www.chess.com/play/computer` (see `frontend/manifest.json`)

## local HTTP server for stockfish (backend)

- has a ready stockfish engine and functions for analysing best moves based on FEN string
- `POST /` endpoint for getting stockfish best move analysis based on chess FEN string
  - `Content-Type: text/plain` request body should be the FEN string to analyze

### Sample request/response

Request

```
POST http://localhost:8080/
Content-Type: text/plain
rnbqkbnr/pp1ppppp/8/2p5/8/3P4/PPP1PPPP/RNBQKBNR w KQkq c6 0 2
```

Response

```
bestmove e2e4 ponder b8c6
```

# installing

## pre-requisites

You need to have these tools:

- git
- node.js 16
- firefox

## installation & usage process

1. clone the repo: `git clone git@github.com:haug1/chess-bot.git`
2. install stockfish server
   1. go to `backend/` directory in terminal
   2. install the dependencies: `npm i`
   3. run the server: `npm start` (must be running for the browser extension to work)
3. install the firefox extension
   1. go to `about:debugging`
   2. click `This Firefox`
   3. click `Load Temporary Add-on...`
   4. choose the `frontend/manifest.json` file
4. go to [chess.com computer play](https://www.chess.com/play/computer) (refreshing page after game begins may be required)
