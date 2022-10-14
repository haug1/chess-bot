#!/bin/bash

FAST_FEN="5R2/p2k1p1P/1P1P1PPr/bPpKBN1p/1pR3n1/7B/2P2N1P/1b6 w KQkq - 0 1" # Expected: bestmove e2e4 ponder b8c6
SLOW_FEN="2rq1rk1/pb3ppp/1p2Bn2/4n3/1P1P2P1/P6P/1B1Q1P2/R3R1K1 b - - 0 20" # Expected: bestmove d8d2
TEST_FEN="3r4/p4pk1/8/1N3b1p/4p3/1P2P1bP/P1rR2PN/2nK1B1R b - - 4 27"

FEN=$TEST_FEN
# curl -v -XPOST -H 'Content-Type: text/plain' -d "$FEN" localhost:8080/fen
curl -v -XPOST -H 'Content-Type: text/plain' -d "$FEN" -N localhost:8080/fen/sse
