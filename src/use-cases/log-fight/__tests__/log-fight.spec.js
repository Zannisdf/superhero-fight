const { buildLogFight } = require('../log-fight');
const fight = require('./fight.json');
const expectedSerialization = require('./serialized-fight.json');

const logFight = buildLogFight();

describe('logFight()', () => {
  it('serializes a fight into a string', () => {
    const serialized = logFight(fight);

    expect(serialized).toEqual(expectedSerialization.fight);
  });
});
