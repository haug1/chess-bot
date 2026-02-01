# stockfish node.js wrapper

## Stockfish

Put stockfish binary as `bin/stockfish` relative to executable.

# Components

- A simple Stockfish wrapper this simply exposes bare-bones functions to interact with the Stockfish CLI.
- A function for evaluating a position based on a FEN string.
- An HTTP server wrapper around the above-mentioned components.
- Simple (not that useful) CLI demo of interacting with the Stockfish wrapper

## HTTP server

Exposes an endpoint that returns a stream of Stockfish evaluations for a given position (based on FEN or list of played moves) until the best move is found or the connection is closed.

Does not handle concurrent requests, meaning there can only be one consumer of the API at a time. To handle concurrent requests one would probably have to launch more instances of the engine, which is currently not being done.

## CLI demo

A very simple CLI demo for testing purposes and shows how the wrapper code can be utilized. (If you really want to interact with the Stockfish engine directly with UCI commands, it's really better to just run the officially distributed binary.)
