function buildRequestHandler(controller) {
  function getHttpRequest(req) {
    return {
      body: req.body,
      query: req.query,
      params: req.params,
      ip: req.ip,
      method: req.method,
      path: req.path,
      headers: {
        'Content-Type': req.get('Content-Type'),
        Referer: req.get('referer'),
        'User-Agent': req.get('User-Agent'),
      },
    };
  }

  return function handleRequest(req, res) {
    const httpRequest = getHttpRequest(req);

    controller(httpRequest)
      .then(({ headers, body, statusCode }) => {
        if (headers) {
          res.set(headers);
        }

        res.type('json');
        res.status(statusCode).send(body);
      })
      .catch(() =>
        res.status(500).send({ error: 'An unkown error occurred.' })
      );
  };
}

module.exports = { buildRequestHandler };
