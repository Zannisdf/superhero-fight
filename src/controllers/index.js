const { doFight } = require('../use-cases');
const { buildGetFight } = require('./get-fight');
const { buildNotFound } = require('./not-found');

const getFight = buildGetFight({
  doFight,
  // This should be extracted to an actual logging library.
  log: console.log,
});
const notFound = buildNotFound();

module.exports = { getFight, notFound };
