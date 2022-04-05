const { createRandomizer } = require('../randomizer');
const { buildCreateCharacter } = require('./character');

const randomize = createRandomizer();

function calculateStamina() {
  const MAX_STAMINA_VALUE = 10;

  return randomize({ ceil: MAX_STAMINA_VALUE });
}

function selectAttack(availableAttacks) {
  const index = randomize({ ceil: availableAttacks.length });
  return availableAttacks[index];
}

const createCharacter = buildCreateCharacter({
  calculateStamina,
  selectAttack,
});

module.exports = { createCharacter };
