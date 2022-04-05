const { buildCreateCharacter } = require('./character');

const createCharacter = buildCreateCharacter({ calculateStamina });

function calculateStamina() {
  return Math.floor(Math.random() * 10);
}

module.exports = { createCharacter };
