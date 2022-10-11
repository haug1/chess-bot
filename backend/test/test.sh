#!/bin/bash

FEN="5R2/p2k1p1P/1P1P1PPr/bPpKBN1p/1pR3n1/7B/2P2N1P/1b6 w KQkq - 0 1"
# curl -XPOST -H "Content-Type: text/plain" -d '2rq1rk1/pb3ppp/1p2Bn2/4n3/1P1P2P1/P6P/1B1Q1P2/R3R1K1 b - - 0 20' localhost:8080/fen
# curl -XPOST -H 'Content-Type: text/plain' -d 'rnbqkbnr/pp1ppppp/8/2p5/8/3P4/PPP1PPPP/RNBQKBNR w KQkq c6 0 2' localhost:8080/fen
curl -XPOST -H 'Content-Type: text/plain' -d "$FEN" localhost:8080/fen
# Expected response: bestmove e2e4 ponder b8c6


# curl -v -H 'Content-Type: text/plain' -d 'rnbqkbnr/pp1ppppp/8/2p5/8/3P4/PPP1PPPP/RNBQKBNR w KQkq c6 0 2' -N localhost:8080/fen/sse
# curl -v -H 'Content-Type: text/plain' -d '2rq1rk1/pb3ppp/1p2Bn2/4n3/1P1P2P1/P6P/1B1Q1P2/R3R1K1 b - - 0 20' -N localhost:8080/fen/sse
