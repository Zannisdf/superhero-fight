function buildMockCharacterCollection(mapperFn = defaultCollectionMapper) {
  return Array(5).fill().map(mapperFn);
}

function defaultCollectionMapper(_, index) {
  return buildMockCharacter({ id: index });
}

function buildMockCharacter(overrides = {}) {
  const id = overrides.id ?? 1;
  let isReadyToFight = overrides.isReadyToFight || false;
  let isDefeated = overrides.isDefeated || false;
  let hp = overrides.hp ?? 100;
  return {
    getId: () => id,
    getName: () => String(`hero-${id}`),
    getAlignment: () => overrides.alignment || 'good',
    isReadyToFight: () => isReadyToFight,
    setFightStatsAndAttacks: jest.fn().mockImplementation(() => {
      isReadyToFight = true;
    }),
    isDefeated: () => isDefeated,
    attack: jest.fn().mockImplementation(() => 100),
    takeDamage: jest.fn().mockImplementation((dmg) => {
      hp = Math.max(hp - dmg, 0);

      if (hp === 0) {
        isDefeated = true;
      }
    }),
    getHP: () => hp,
    recover: () => {
      hp = overrides.hp ?? 100;
      return hp;
    },
    ...overrides,
  };
}

module.exports = { buildMockCharacter, buildMockCharacterCollection }
