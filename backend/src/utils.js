function debug(...params) {
  if (process.env.DEBUG) {
    console.debug(...params);
  }
}

module.exports = {
  debug,
};
