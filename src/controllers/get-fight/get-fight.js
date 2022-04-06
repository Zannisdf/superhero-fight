function buildGetFight({ doFight, log }) {
  return async function getFight() {
    const headers = {
      'Content-Type': 'application/json',
    };
    try {
      const fight = await doFight();

      return {
        headers,
        statusCode: 200,
        body: fight,
      };
    } catch (error) {
      log(error);

      return {
        headers,
        statusCode: 400,
        body: {
          error: error.message,
        },
      };
    }
  };
}

module.exports = { buildGetFight };
