const debug = false;

module.exports = {
  debug(msg) {
    if (debug) console.log(msg);
  },
  log(msg) {
    console.log(msg);
  },
};
