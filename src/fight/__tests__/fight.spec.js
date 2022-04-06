const { buildMockTeam } = require('../../../test/helpers/build-mock-team');
const { buildCreateFight } = require('../fight');

const createFight = buildCreateFight();

describe('createFight', () => {
  it('throws an error when initialized with a non-array teams instance', () => {
    expect(() => createFight({ teams: {} })).toThrowError(
      '`teams` must be an instance of Array!'
    );
  });

  it('throws an error when given teams with a size different than two', () => {
    expect(() => createFight({ teams: [] })).toThrowError(
      'A fight can only be held between 2 teams!'
    );
  });

  describe('getTurn()', () => {
    it('returns the current fight turn', () => {
      const teams = [buildMockTeam(), buildMockTeam()];
      const fight = createFight({ teams });

      expect(fight.getTurn()).toEqual(1);
    });
  });

  describe('getAttackingTeam()', () => {
    it('returns the attacking team', () => {
      const teams = [buildMockTeam(), buildMockTeam()];
      const fight = createFight({ teams });

      expect(fight.getAttackingTeam()).toBe(teams[0]);
    });
  });

  describe('getDefendingTeam()', () => {
    it('returns the defending team', () => {
      const teams = [buildMockTeam(), buildMockTeam()];
      const fight = createFight({ teams });

      expect(fight.getDefendingTeam()).toBe(teams[1]);
    });
  });

  describe('start()', () => {
    it('executes a fight until a team is defeated', () => {
      const teams = [buildMockTeam(), buildMockTeam()];
      const fight = createFight({ teams });

      fight.start();

      expect(fight.isFinished()).toBe(true);
      expect(fight.getTurn()).toBe(3);
    });
  });

  describe('isFinished()', () => {
    it('returns true if the fight already ended', () => {
      const teams = [buildMockTeam(), buildMockTeam()];
      const fight = createFight({ teams });

      fight.start();

      expect(fight.isFinished()).toBe(true);
    });

    it('returns false if the fight has not started', () => {
      const teams = [buildMockTeam(), buildMockTeam()];
      const fight = createFight({ teams });

      expect(fight.isFinished()).toBe(false);
    });
  });

  describe('getWinner()', () => {
    it('returns the winning team if the game is finished', () => {
      const teams = [buildMockTeam(), buildMockTeam()];
      const fight = createFight({ teams });

      fight.start();

      expect(fight.getWinner()).toBe(teams[0]);
    });

    it('returns null if the game is not finished', () => {
      const teams = [buildMockTeam(), buildMockTeam()];
      const fight = createFight({ teams });

      expect(fight.getWinner()).toBeNull();
    });
  });

  describe('getTurnHistory', () => {
    it('returns a log of all turns played', () => {
      const teams = [buildMockTeam(), buildMockTeam()];
      const fight = createFight({ teams });

      fight.start();

      expect(fight.getTurnHistory()).toStrictEqual([
        {
          id: 1,
          attacker: 'attacker',
          damage: 50,
          defender: 'defender',
          hp: 50,
        },
        {
          id: 2,
          attacker: 'attacker',
          damage: 50,
          defender: 'defender',
          hp: 50,
        },
        {
          id: 3,
          attacker: 'attacker',
          damage: 50,
          defender: 'defender',
          hp: 0,
        },
      ]);
    });
  });
});
