#!/bin/sh

curl -vvv -XPOST -H "Content-Type: application/json" -d '{"fen":"r1bqk2r/pppn1pp1/3p3p/8/1b2nP2/P5PB/1BPPP2P/RN1QK2R b KQkq - 0 9"}' localhost:8080
