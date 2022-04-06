const {
  buildMockCharacter,
  buildMockCharacterCollection,
} = require('../../../test/helpers/build-mock-character');
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
    it('returns false if there are any active characters', () => {
      const characters = buildMockCharacterCollection();
      const team = createTeam({ characters });

      expect(team.isDefeated()).toBe(false);

      team.switchFighter();

      expect(team.isDefeated()).toBe(false);
    });

    it('returns true if there arent any active characters left', () => {
      const characters = buildMockCharacterCollection();
      const team = createTeam({ characters });

      team.switchFighter();
      team.switchFighter();
      team.switchFighter();
      team.switchFighter();
      team.switchFighter();

      expect(team.isDefeated()).toBe(true);
    });
  });

  describe('getCurrentFighter()', () => {
    it('returns the active character', () => {
      const characters = buildMockCharacterCollection();
      const team = createTeam({ characters });

      expect(team.getCurrentFighter()).toBe(characters[0]);

      team.switchFighter();

      expect(team.getCurrentFighter()).toBe(characters[1]);
    });

    it('returns null when there are no undefeated characters', () => {
      const characters = buildMockCharacterCollection();
      const team = createTeam({ characters });

      team.switchFighter();
      team.switchFighter();
      team.switchFighter();
      team.switchFighter();
      team.switchFighter();

      expect(team.getCurrentFighter()).toBeNull();
    });
  });

  describe('performAttack()', () => {
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

      team.switchFighter();
      team.switchFighter();
      team.switchFighter();
      team.switchFighter();
      team.switchFighter();

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

    it('throws an error when invoked on a defeated team', () => {
      const characters = buildMockCharacterCollection();
      const team = createTeam({ characters });

      team.switchFighter();
      team.switchFighter();
      team.switchFighter();
      team.switchFighter();
      team.switchFighter();

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

  describe('prepareCurrentFighter()', () => {
    it('marks the active character as ready to fight', () => {
      const characters = buildMockCharacterCollection();
      const team = createTeam({ characters });

      expect(team.getCurrentFighter().isReadyToFight()).toBe(false);

      team.prepareCurrentFighter();

      expect(team.getCurrentFighter().isReadyToFight()).toBe(true);
    });

    it('does not mark the active character as ready to fight if it was previously marked', () => {
      const characters = buildMockCharacterCollection();
      const team = createTeam({ characters });

      team.prepareCurrentFighter();
      team.prepareCurrentFighter();

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

      team.prepareCurrentFighter();

      expect(
        team.getCurrentFighter().setFightStatsAndAttacks
      ).toHaveBeenCalledWith({ filiationCoef: 0.5 });

      team.switchFighter();
      team.prepareCurrentFighter();

      expect(
        team.getCurrentFighter().setFightStatsAndAttacks
      ).toHaveBeenCalledWith({ filiationCoef: 2 });
    });
  });

  describe('isCurrentFighterDefeated()', () => {
    it('returns true if the fighters hp is zero', () => {
      const characters = buildMockCharacterCollection();
      const team = createTeam({ characters });

      team.takeDamage(100);

      expect(team.isCurrentFighterDefeated()).toBe(true);
    });

    it('returns false if the fighters hp is greater than zero', () => {
      const characters = buildMockCharacterCollection();
      const team = createTeam({ characters });

      team.takeDamage(50);

      expect(team.isCurrentFighterDefeated()).toBe(false);
    });
  });
});
