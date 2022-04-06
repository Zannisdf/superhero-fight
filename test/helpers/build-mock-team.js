function buildMockTeam(overrides = {}) {
  let heroHP = 100;

  return {
    performAttack: jest
      .fn()
      .mockImplementation(() => ({ attacker: 'attacker', damage: 50 })),
    takeDamage: jest.fn().mockImplementation((damage) => {
      heroHP = Math.max(heroHP - damage, 0);
      return { defender: 'defender', hp: heroHP };
    }),
    prepareCurrentFighter: jest.fn(),
    isCurrentFighterDefeated: jest
      .fn()
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true),
    isDefeated: jest.fn().mockReturnValueOnce(false).mockReturnValueOnce(true),
    switchFighter: jest.fn().mockReturnValueOnce(null),
    recoverCurrentFighter: jest.fn(),
    ...overrides,
  };
}

module.exports = { buildMockTeam };
