# chess-bot

Provides stockfish best move analysis during gameplay (vs the computer) on `chess.com` or `lichess` with Firefox browser

![firefox_EwkQNvchKq](https://user-images.githubusercontent.com/31956036/195960766-e7392aef-c9b2-476e-a78b-f8a8923d9cd2.gif)

Go to [installing/usage](#installing)

# info

The product consists of 2 components:

## firefox extension (frontend)

- asks the stockfish server for the best move based on the current game state and updates whenever opponent makes a move happens
- displays the stockfish evaluation on the web page with highlights on the board (chess.com/lichess)
- click 'refresh' button if the game gets out of sync

## local HTTP server for stockfish evaluation as a service (backend, runs on your local computer)

(OUTDATED)

- has a ready stockfish engine and functions for analysing best moves based on FEN string
- `POST /` endpoint for getting stockfish best move analysis based on chess FEN string
  - `Content-Type: text/plain` request body should be the FEN string to analyze

### Sample request/response (OUTDATED)

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
- node.js 16+
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
   4. choose the `frontend/bin/manifest.json` file
4. go to chess.com/lichess and play vs the computer
5. click 'refresh' if game gets out of sync (shouldn't really happen)
