const { buildCreateTeam } = require('../team');

const DEFAULT_FILIATION_BONUS = 1;

const createTeam = buildCreateTeam({
  calculateFiliationBonus: () => DEFAULT_FILIATION_BONUS,
});

describe('createTeam', () => {
  it('throws an error when `characters` is not an array', () => {
    expect(() => createTeam({ characters: {} })).toThrowError(
      'Characters must be an array instance'
    );
  });

  it('throws an error when the team size is different than 5', () => {
    expect(() => createTeam({ characters: [] })).toThrowError(
      'A team must contain 5 characters'
    );
  });

  it('throws an error when initialized with duplicated character ids', () => {
    expect(() =>
      createTeam({ characters: Array(5).fill().map(buildMockCharacter) })
    ).toThrowError('A team can only have unique characters');
  });

  describe('getAlignment()', () => {
    it('returns the team alignment based on the most equally aligned characters', () => {
      const characters = buildMockCharacterCollection((_, index) =>
        buildMockCharacter({
          id: index,
          alignment: index % 2 === 0 ? 'bad' : 'good',
        })
      );
      const team = createTeam({ characters });

      expect(team.getAlignment()).toEqual('bad');
    });
  });

  describe('getCharacters()', () => {
    it('returns the team characters', () => {
      const characters = buildMockCharacterCollection();
      const team = createTeam({ characters });

      expect(team.getCharacters()).toBe(characters);
    });
  });

  describe('getName()', () => {
    it('returns the team name based on the first character', () => {
      const characters = buildMockCharacterCollection();
      const team = createTeam({ characters });

      expect(team.getName()).toEqual("hero-0's team");
    });
  });

  describe('isDefeated()', () => {
    it('returns false if there are any characters with hp greater than 0', () => {
      const characters = buildMockCharacterCollection();
      const team = createTeam({ characters });

      expect(team.isDefeated()).toBe(false);
    });

    it('returns true if all characters have no hp left', () => {
      const characters = buildMockCharacterCollection();
      const team = createTeam({ characters });

      team.takeDamage(100);
      team.takeDamage(100);
      team.takeDamage(100);
      team.takeDamage(100);
      team.takeDamage(100);

      expect(team.isDefeated()).toBe(true);
    });
  });

  describe('getCurrentFighter()', () => {
    it('returns the active character', () => {
      const characters = buildMockCharacterCollection();
      const team = createTeam({ characters });

      expect(team.getCurrentFighter()).toBe(characters[0]);

      team.takeDamage(100);

      expect(team.getCurrentFighter()).toBe(characters[1]);
    });

    it('returns null when there are no undefeated characters', () => {
      const characters = buildMockCharacterCollection();
      const team = createTeam({ characters });

      team.takeDamage(100);
      team.takeDamage(100);
      team.takeDamage(100);
      team.takeDamage(100);
      team.takeDamage(100);

      expect(team.getCurrentFighter()).toBeNull();
    });
  });

  describe('performAttack()', () => {
    it('marks the active character as ready to fight', () => {
      const characters = buildMockCharacterCollection();
      const team = createTeam({ characters });

      expect(team.getCurrentFighter().isReadyToFight()).toBe(false);

      team.performAttack();

      expect(team.getCurrentFighter().isReadyToFight()).toBe(true);
    });

    it('does not mark the active character as ready to fight if it was previously marked', () => {
      const characters = buildMockCharacterCollection();
      const team = createTeam({ characters });

      team.performAttack();
      team.performAttack();

      expect(
        team.getCurrentFighter().setFightStatsAndAttacks
      ).toHaveBeenCalledTimes(1);
    });

    it('invokes `character.setFightStatsAndAttacks` with the filiation coef based on the character alignment', () => {
      const characters = buildMockCharacterCollection((_, index) =>
        buildMockCharacter({
          id: index,
          alignment: index === 0 ? 'good' : 'bad',
        })
      );
      const team = createTeam({ characters });

      team.performAttack();

      expect(
        team.getCurrentFighter().setFightStatsAndAttacks
      ).toHaveBeenCalledWith(0.5);

      team.takeDamage(100);
      team.performAttack();

      expect(
        team.getCurrentFighter().setFightStatsAndAttacks
      ).toHaveBeenCalledWith(2);
    });

    it('returns an object with the damage dealt and attacker name', () => {
      const characters = buildMockCharacterCollection();
      const team = createTeam({ characters });

      expect(team.performAttack()).toStrictEqual({
        attacker: 'hero-0',
        damage: 100,
      });
    });

    it('throws an error when invoked on a defeated team', () => {
      const characters = buildMockCharacterCollection();
      const team = createTeam({ characters });

      team.takeDamage(100);
      team.takeDamage(100);
      team.takeDamage(100);
      team.takeDamage(100);
      team.takeDamage(100);

      expect(() => team.performAttack()).toThrowError(
        'There are no more active fighters in the team!'
      );
    });
  });

  describe('takeDamage()', () => {
    it('removes the hp from the current fighter', () => {
      const characters = buildMockCharacterCollection();
      const team = createTeam({ characters });

      team.takeDamage(50);

      expect(team.getCurrentFighter().getHP()).toStrictEqual(50);
    });

    it('swaps the current character when defeated', () => {
      const characters = buildMockCharacterCollection();
      const team = createTeam({ characters });

      team.takeDamage(100);

      expect(team.getCurrentFighter()).toBe(characters[1]);
    });

    it('throws an error when invoked on a defeated team', () => {
      const characters = buildMockCharacterCollection();
      const team = createTeam({ characters });

      team.takeDamage(100);
      team.takeDamage(100);
      team.takeDamage(100);
      team.takeDamage(100);
      team.takeDamage(100);

      expect(() => team.takeDamage(100)).toThrowError(
        'There are no more active fighters in the team!'
      );
    });
  });

  describe('recoverCurrentFighter()', () => {
    it('restores the current character hp', () => {
      const characters = buildMockCharacterCollection();
      const team = createTeam({ characters });

      team.takeDamage(50);
      team.recoverCurrentFighter();

      expect(team.getCurrentFighter().getHP()).toStrictEqual(100);
    });

    it('returns the resulting hp', () => {
      const characters = buildMockCharacterCollection();
      const team = createTeam({ characters });

      team.takeDamage(50);
      const hp = team.recoverCurrentFighter();

      expect(hp).toEqual(100);
    });
  });
});

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
  };
}
