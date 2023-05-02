# stockfish node.js wrapper

Aims to provide a simple node.js wrapper for Stockfish that is up-to-date as best as possible and has an intuitive and user-friendly interface.

(Does not attempt to run in the browser, but rather have a preference towards performance running as a separate desktop application.)

## Components

- A simple Stockfish wrapper this simply exposes bare-bones functions to interact with the Stockfish CLI.
- A function for evaluating a position based on a FEN string.
- An HTTP server wrapper around the above-mentioned components.
- Simple (not that useful) CLI demo of interacting with the Stockfish wrapper

## CLI demo

A very simple CLI demo that simply proves the concept and shows how the wrapper code can be utilized. (If you really want to interact with the Stockfish engine through commands, it's really better to just use the officially distributed binary)

## HTTP server

Exposes an endpoint that returns a stream of Stockfish evaluations for a FEN string until the best move is found or the connection is closed.

Does not handle concurrent requests, meaning there can only be one consumer of the API at a time. To handle concurrent requests one would probably have to launch more instances of the engine, which is currently not being done.

# TODO

- offline mode

The program currently requires an internet connection starting up because it checks for the latest version of Stockfish. There should be a fallback in case there is no internet connection and a Stockfish binary file is already available.
