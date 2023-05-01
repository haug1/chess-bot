# stockfish node.js wrapper

Aims to provide a simple node.js wrapper for Stockfish that is up-to-date as best as possible and has an intuitive and user-friendly interface.

## Components

- A simple Stockfish wrapper this simply exposes bare-bones functions to interact with the Stockfish CLI.
- A function for evaluating a position based on a FEN string.
- (TODO) An HTTP server wrapper around the above-mentioned components.
- Simple (not that useful) CLI demo of interacting with the Stockfish wrapper

## CLI demo

A very simple CLI demo that simply proves the concept and shows how the wrapper code can be utilized.

## HTTP server (TODO)

Exposes an endpoint that returns a stream of Stockfish evaluations for a FEN string until the best move is found or the connection is closed.
