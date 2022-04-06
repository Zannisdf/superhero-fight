const { characterService } = require('../services/character');
const { createRandomizer } = require('../randomizer');
const { parse } = require('../lib/html-parser');
const { buildGetCharacterIds } = require('./get-character-ids');
const { buildDoFight } = require('./do-fight');

const randomize = createRandomizer();

const getCharacterIds = buildGetCharacterIds({ characterService, parse });
const doFight = buildDoFight({
  characterService,
  getCharacterIds,
  randomize,
});

module.exports = { doFight, getCharacterIds };
