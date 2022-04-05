const { createRandomizer } = require('../randomizer');
const { buildCreateTeam } = require('./team');

const randomize = createRandomizer();

function calculateFiliationBonus() {
  const MAX_FILIATION_BONUS_VALUE = 9;

  return randomize({ ceil: MAX_FILIATION_BONUS_VALUE });
}

const createTeam = buildCreateTeam({ calculateFiliationBonus });

module.exports = { createTeam };
