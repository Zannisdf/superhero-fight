const axios = require('axios').default;

const SUPPORTED_METHODS = {
  GET: 'get',
};

// Since there are valid use cases where we might want to customize the rest
// client (e.g. logging, caching, etc), we define it as a class
// so our users can easily extend its behavior without having to deal with
// prototypes.
class RestClient {
  constructor(config = {}) {
    this.config = config;
    this.client = axios.create(config);
  }

  // Generic request method. All rest method implementations must derive from this.
  doRequest(options) {
    return this.client.request(options);
  }

  get(url, options) {
    return this.doRequest({ ...options, url, method: SUPPORTED_METHODS.GET });
  }
}

module.exports = { RestClient };
