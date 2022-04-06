const { createRestClient } = require('../../lib/rest-client');
const { createCharacterService } = require('./character-service');

const restclient = createRestClient();
const characterService = createCharacterService({ restclient });

module.exports = { characterService };
