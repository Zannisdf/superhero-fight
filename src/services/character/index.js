const { createRestClient } = require('../../lib/rest-client');
const { createCharacterService } = require('./character-service');

const restclient = createRestClient();
const characterService = createCharacterService({ restclient, getSecret });

function getSecret() {
  const secret = process.env.API_KEY;

  if (!secret) {
    throw new Error('An api key has not been set');
  }

  return secret;
}

module.exports = { characterService };
