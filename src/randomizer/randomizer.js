function createRandomizer({ random = Math.random } = {}) {
  return function randomize({ ceil }) {
    return Math.floor(random() * ceil);
  };
}

module.exports = { createRandomizer };
