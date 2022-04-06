const { RestClient } = require('./rest-client');

function createRestClient(config) {
  const restclient = new RestClient(config);
  return restclient;
}

module.exports = { RestClient, createRestClient };
