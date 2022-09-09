#!/bin/sh

curl -XPOST -H 'Content-Type: text/plain' -d 'rnbqkbnr/pp1ppppp/8/2p5/8/3P4/PPP1PPPP/RNBQKBNR w KQkq c6 0 2' localhost:8080
# Expected response: bestmove e2e4 ponder b8c6
