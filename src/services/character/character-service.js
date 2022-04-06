const BASE_SERVICE_URL = 'https://superheroapi.com';

function createCharacterService({ restclient, getSecret }) {
  function getAvailableIds() {
    const ENDPOINT = 'ids.html';
    return restclient
      .get(`${BASE_SERVICE_URL}/${ENDPOINT}`)
      .then(({ data }) => data);
  }

  function getCharactersInfo(ids) {
    return Promise.all(ids.map(getCharacterInfo));
  }

  function getCharacterInfo(id) {
    const ENDPOINT = `api.php/${getSecret()}/${id}`;
    return restclient
      .get(`${BASE_SERVICE_URL}/${ENDPOINT}`)
      .then(({ data }) => data);
  }

  return Object.freeze({
    getAvailableIds,
    getCharactersInfo,
    getCharacterInfo,
  });
}

module.exports = { createCharacterService };
