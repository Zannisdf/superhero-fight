const { characterService } = require('../services/character');
const { createRandomizer } = require('../randomizer');
const { parse } = require('../lib/html-parser');
const { buildGetCharacterIds } = require('./get-character-ids');
const { buildGetFight } = require('./get-fight');

const randomize = createRandomizer();

const getCharacterIds = buildGetCharacterIds({ characterService, parse });
const getFight = buildGetFight({
  characterService,
  getCharacterIds,
  randomize,
});

module.exports = { getFight };
