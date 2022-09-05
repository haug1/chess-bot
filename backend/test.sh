#!/bin/sh

curl -XPOST -H "Content-Type: application/json" -d '{"fen":"rnbqkbnr/pp1ppppp/8/2p5/8/3P4/PPP1PPPP/RNBQKBNR w KQkq c6 0 2"}' localhost:8080
