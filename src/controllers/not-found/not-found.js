function buildNotFound() {
  return async function notFound() {
    return {
      headers: {
        'Content-Type': 'application/json',
      },
      body: { error: 'Not found.' },
      statusCode: 404,
    };
  };
}

module.exports = { buildNotFound };
