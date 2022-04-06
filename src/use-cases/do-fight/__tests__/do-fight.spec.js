const { buildGetFight } = require('../do-fight');

describe('getFight()', () => {
  it('returns the stats for a fight', async () => {
    const mockCharacterService = buildMockCharacterService();
    mockCharacterService.getCharactersInfo.mockImplementation(
      createCharacterCollectionFixtures
    );
    const getFight = buildGetFight({
      characterService: mockCharacterService,
      getCharacterIds: mockGetCharacterIds,
      randomize: createMockRandomizer(),
    });
    const fightStats = await getFight();

    expect(fightStats).toStrictEqual({
      turns: expect.any(Number),
      teams: expect.arrayContaining([
        expect.objectContaining({
          members: expect.arrayContaining([expect.any(String)]),
          name: expect.any(String),
        }),
      ]),
      winner: expect.any(String),
      history: expect.arrayContaining([
        expect.objectContaining({
          attacker: expect.any(String),
          damage: expect.any(Number),
          defender: expect.any(String),
          hp: expect.any(Number),
          id: expect.any(Number),
        }),
      ]),
    });
  });
});

function buildMockCharacterService(overrides = {}) {
  return {
    getCharactersInfo: jest.fn(),
    ...overrides,
  };
}

function createCharacterCollectionFixtures(ids) {
  return ids.map(createCharacterFixtures);
}

function createCharacterFixtures(id) {
  return {
    id,
    alignment: id % 2 === 0 ? 'good' : 'bad',
    name: `hero-${id}`,
    combat: 1,
    durability: 1,
    intelligence: 1,
    power: 1,
    speed: 1,
    strength: 1,
  };
}

function createMockRandomizer() {
  let number = -1;

  return function randomize() {
    number++;
    return number;
  };
}

function mockGetCharacterIds() {
  return Promise.resolve(
    Array(15)
      .fill(1)
      .map((value, index) => value + index)
  );
}
