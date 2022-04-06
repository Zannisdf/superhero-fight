function buildGetFightLog({ doFight, logFight, log }) {
  return async function getFightLog() {
    const headers = {
      'Content-Type': 'text/html',
    };
    try {
      const fight = await doFight();
      const fightLog = logFight(fight);
      console.log(JSON.stringify(fight));
      console.log(JSON.stringify(fightLog));

      return {
        headers,
        statusCode: 200,
        body: fightLog,
      };
    } catch (error) {
      log(error);

      return {
        headers,
        statusCode: 400,
        body: 'Oops! An error has ocurred',
      };
    }
  };
}

module.exports = { buildGetFightLog };
