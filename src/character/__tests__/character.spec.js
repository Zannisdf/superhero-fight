const { buildCreateCharacter } = require('../character');

const DEFAULT_STAMINA = 9;
const DEFAULT_ID = 1;
const DEFAULT_ALIGNMENT = 'good';
const DEFAULT_FILIATION_COEF = 1;
const DEFAULT_NAME = 'Batman';

const createCharacter = buildCreateCharacter({
  calculateStamina: () => DEFAULT_STAMINA,
  selectAttack: ([firstAttack]) => firstAttack,
});

describe('createCharacter', () => {
  it('throws an error when no id is provided', () => {
    expect(() => createCharacter({})).toThrowError('Character must have an id');
  });

  it('throws an error when no name is provided', () => {
    expect(() => createCharacter({ id: DEFAULT_ID })).toThrowError(
      'Character must have a name'
    );
  });

  it('throws an error when no alignment is provided', () => {
    expect(() =>
      createCharacter({ id: DEFAULT_ID, name: DEFAULT_NAME })
    ).toThrowError('Character must have an alignment');
  });

  describe('getAlignment()', () => {
    it('returns the character alignment', () => {
      const alignment = 'good';
      const character = createCharacter(buildCharacterAttrs({ alignment }));

      expect(character.getAlignment()).toEqual(alignment);
    });
  });

  describe('getId()', () => {
    it('returns the character id', () => {
      const id = 1;
      const character = createCharacter(buildCharacterAttrs({ id }));

      expect(character.getId()).toEqual(id);
    });
  });

  describe('getName()', () => {
    it('returns the character name', () => {
      const name = 'Luffy';
      const character = createCharacter(buildCharacterAttrs({ name }));

      expect(character.getName()).toEqual(name);
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
      const initialHP = character.getHP();
      const damage = 1;

      character.takeDamage(damage);

      expect(character.getHP()).toEqual(initialHP - damage);
    });

    it('returns the remaining hp', () => {
      const character = createCharacter(
        buildCharacterAttrs({ strength: 1, durability: 1, power: 1 })
      );
      const remaining = character.takeDamage(1);

      expect(character.getHP()).toEqual(remaining);
    });
  });

  describe('recover()', () => {
    it('resets character hp to the initial amount', () => {
      const character = createCharacter(
        buildCharacterAttrs({ strength: 1, durability: 1, power: 1 })
      );
      const initialHP = character.getHP();

      character.takeDamage(1);
      character.takeDamage(15);
      character.recover();

      expect(character.getHP()).toEqual(initialHP);
    });

    it('returns the remaining hp', () => {
      const character = createCharacter(
        buildCharacterAttrs({ strength: 1, durability: 1, power: 1 })
      );
      const initialHP = character.getHP();

      character.takeDamage(1);

      expect(character.recover()).toEqual(initialHP);
    });
  });

  describe('mentalAttack()', () => {
    it('returns the value based on the current stats', () => {
      const character = createCharacter(
        buildCharacterAttrs({ intelligence: 1, speed: 1, combat: 1 })
      );
      character.setFightStatsAndAttacks({
        filiationCoef: DEFAULT_FILIATION_COEF,
      });

      expect(character.mentalAttack()).toEqual(10);
    });
  });

  describe('strongAttack()', () => {
    it('returns the value based on the current stats', () => {
      const character = createCharacter(
        buildCharacterAttrs({ strength: 1, power: 1, combat: 1 })
      );
      character.setFightStatsAndAttacks({
        filiationCoef: DEFAULT_FILIATION_COEF,
      });

      expect(character.strongAttack()).toEqual(10);
    });
  });

  describe('fastAttack()', () => {
    it('returns the value based on the current stats', () => {
      const character = createCharacter(
        buildCharacterAttrs({ speed: 1, durability: 1, strength: 1 })
      );
      character.setFightStatsAndAttacks({
        filiationCoef: DEFAULT_FILIATION_COEF,
      });

      expect(character.fastAttack()).toEqual(10);
    });
  });

  describe('performRandomAttack()', () => {
    it('performs the `selectAttack` returned method', () => {
      const selectAttack = jest
        .fn()
        .mockImplementationOnce((attacks) => attacks[0])
        .mockImplementationOnce((attacks) => attacks[1])
        .mockImplementationOnce((attacks) => attacks[2]);
      const doCreateCharacter = buildCreateCharacter({
        calculateStamina: () => DEFAULT_STAMINA,
        selectAttack,
      });
      const character = doCreateCharacter(
        buildCharacterAttrs({
          intelligence: 1,
          speed: 2,
          combat: 3,
          durability: 4,
          strength: 5,
          power: 6,
        })
      );

      character.setFightStatsAndAttacks({
        filiationCoef: DEFAULT_FILIATION_COEF,
      });

      expect(character.performRandomAttack()).toEqual(character.mentalAttack());
      expect(character.performRandomAttack()).toEqual(character.strongAttack());
      expect(character.performRandomAttack()).toEqual(character.fastAttack());
    });
  });

  describe('isDefeated()', () => {
    it('returns true when hp is zero', () => {
      const character = createCharacter(
        buildCharacterAttrs({ strength: 1, durability: 1, power: 1 })
      );
      const initialHP = character.getHP();

      character.takeDamage(initialHP);

      expect(character.isDefeated()).toBe(true);
    });

    it('returns false when hp is greater than zero', () => {
      const character = createCharacter(
        buildCharacterAttrs({ strength: 1, durability: 1, power: 1 })
      );
      const initialHP = character.getHP();

      character.takeDamage(initialHP / 2);

      expect(character.isDefeated()).toBe(false);
    });
  });

  describe('isReadyToFight', () => {
    it('returns true when the filiation coeficient has been set', () => {
      const character = createCharacter(
        buildCharacterAttrs({ speed: 1, durability: 1, strength: 1 })
      );
      character.setFightStatsAndAttacks({
        filiationCoef: DEFAULT_FILIATION_COEF,
      });

      expect(character.isReadyToFight()).toBe(true);
    });

    it('returns false when the filiation coeficient has not been set', () => {
      const character = createCharacter(
        buildCharacterAttrs({ speed: 1, durability: 1, strength: 1 })
      );
      expect(character.isReadyToFight()).toBe(false);
    });
  });

  testFightStats();
});

function buildCharacterAttrs(overrides = {}) {
  return {
    id: DEFAULT_ID,
    alignment: DEFAULT_ALIGNMENT,
    filiationCoef: DEFAULT_FILIATION_COEF,
    name: DEFAULT_NAME,
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
      const character = createCharacter(buildCharacterAttrs({ [stat]: 1 }));

      character.setFightStatsAndAttacks({
        filiationCoef: DEFAULT_FILIATION_COEF,
      });

      expect(character[getter]()).toEqual(10);
    });
  });
}
