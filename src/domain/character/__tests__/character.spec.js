const { buildCreateCharacter } = require('../character');

const DEFAULT_STAMINA = 9;
const DEFAULT_ID = 1;
const DEFAULT_ALIGNMENT = 'good';
const DEFAULT_FILIATION_COEF = 1;

const createCharacter = buildCreateCharacter({
  calculateStamina: () => DEFAULT_STAMINA,
});

describe('createCharacter', () => {
  it('throws an error when no id is provided', () => {
    expect(() => createCharacter({})).toThrowError('Character must have an id');
  });

  it('throws an error when no alignment is provided', () => {
    expect(() => createCharacter({ id: 1 })).toThrowError(
      'Character must have an alignment'
    );
  });

  describe('getAlignment()', () => {
    it('returns the character alignment', () => {
      const alignment = 'good';
      const character = createCharacter({ id: 1, alignment });

      expect(character.getAlignment()).toEqual(alignment);
    });
  });

  describe('getId()', () => {
    it('returns the character id', () => {
      const id = 1;
      const character = createCharacter({ id, alignment: 'good' });

      expect(character.getId()).toEqual(id);
    });
  });

  describe('getStamina()', () => {
    it('returns the stamina value', () => {
      const character = createCharacter(buildCharacterAttrs());

      expect(character.getStamina()).toEqual(DEFAULT_STAMINA);
    });
  });

  describe('getHP()', () => {
    it('returns the weighted hp value', () => {
      const character = createCharacter(
        buildCharacterAttrs({ strength: 1, durability: 1, power: 1 })
      );

      expect(character.getHP()).toEqual(102.375);
    });
  });

  describe('takeDamage()', () => {
    it('substracts hp from the character', () => {
      const character = createCharacter(
        buildCharacterAttrs({ strength: 1, durability: 1, power: 1 })
      );
      character.takeDamage(1);

      expect(character.getHP()).toEqual(101.375);
    });

    it('returns the remaining hp', () => {
      const character = createCharacter(
        buildCharacterAttrs({ strength: 1, durability: 1, power: 1 })
      );
      const remaining = character.takeDamage(1);

      expect(character.getHP()).toEqual(remaining);
    });
  });

  describe('mentalAttack()', () => {
    it('returns the value based on the current stats', () => {
      const character = createCharacter(
        buildCharacterAttrs({ intelligence: 1, speed: 1, combat: 1 })
      );

      expect(character.mentalAttack()).toEqual(10);
    });
  });

  describe('strongAttack()', () => {
    it('returns the value based on the current stats', () => {
      const character = createCharacter(
        buildCharacterAttrs({ strength: 1, power: 1, combat: 1 })
      );

      expect(character.strongAttack()).toEqual(10);
    });
  });

  describe('fastAttack()', () => {
    it('returns the value based on the current stats', () => {
      const character = createCharacter(
        buildCharacterAttrs({ speed: 1, durability: 1, strength: 1 })
      );

      expect(character.fastAttack()).toEqual(10);
    });
  });

  testFightStats();
});

function buildCharacterAttrs(overrides = {}) {
  return {
    id: DEFAULT_ID,
    alignment: DEFAULT_ALIGNMENT,
    filiationCoef: DEFAULT_FILIATION_COEF,
    ...overrides,
  };
}

// As all stats will have the same value, we use this helper
// to test every stat getter. Notice that for a stat value of
// 1, a filiationCoef of 1, and a stamina of 9 the expected result is always 10.
function testFightStats() {
  const FIGHT_STATS = [
    'combat',
    'durability',
    'intelligence',
    'power',
    'speed',
    'strength',
  ];

  FIGHT_STATS.forEach(testFightStat);
}

function testFightStat(stat) {
  if (!stat) {
    throw new Error(
      'stat must be defined when calling testFightStat. Did you mean `testFightStats`?'
    );
  }

  const getter = `get${stat[0].toUpperCase()}${stat.slice(1)}`;

  describe(`${getter}()`, () => {
    it(`returns the weighted ${stat} value`, () => {
      const character = createCharacter(
        buildCharacterAttrs({ [stat]: 1, filiationCoef: 1 })
      );

      expect(character[getter]()).toEqual(10);
    });
  });
}
