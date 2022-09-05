#!/usr/bin/env node

const express = require("express");
const { getBestMoveBasedOnFEN } = require("./stockfish");

const app = express();
const port = 8080;

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.post("/", async (request, response) => {
  try {
    response.send(await getBestMoveBasedOnFEN(request.body.fen));
  } catch (e) {
    console.error(e);
    response.status(500);
    response.send(e.message);
  }
});

app.listen(port, () => console.log(`server is listening on ${port}`));
