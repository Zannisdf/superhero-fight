const { doFight, logFight } = require('../use-cases');
const { buildGetFight } = require('./get-fight');
const { buildGetFightLog } = require('./get-fight-log');
const { buildNotFound } = require('./not-found');

const getFight = buildGetFight({
  doFight,
  // This should be extracted to an actual logging library.
  log: console.log,
});
const getFightLog = buildGetFightLog({
  doFight,
  logFight,
  log: console.log,
});
const notFound = buildNotFound();

module.exports = { getFight, getFightLog, notFound };
