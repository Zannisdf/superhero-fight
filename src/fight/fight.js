function buildCreateFight() {
  return function createFight({ teams }) {
    const REQUIRED_TEAMS = 2;

    if (!Array.isArray(teams)) {
      throw new Error('`teams` must be an instance of Array!');
    }

    if (teams.length !== REQUIRED_TEAMS) {
      throw new Error(
        `A fight can only be held between ${REQUIRED_TEAMS} teams!`
      );
    }

    let turn = 1;
    let isFinished = false;
    let currentTeamIndex = 0;
    const turnHistory = [];

    function start() {
      while (!isFinished) {
        playTurn();
      }
    }

    function playTurn() {
      const activeTeam = getActiveTeam();
      const inactiveTeam = getInactiveTeam();
      const { attacker, damage } = activeTeam.performAttack();
      const { defender, hp } = inactiveTeam.takeDamage(damage);

      if (hp === 0) {
        const nextFighter = inactiveTeam.switchFighter();
        activeTeam.restoreCurrentFighter();

        if (!nextFighter) {
          setIsFinished(true);
        }
      }

      const turnStats = { id: turn, attacker, damage, defender, hp };
      turnHistory.push(turnStats);

      switchActiveTeam();
      nextTurn();

      return turnStats;
    }

    function getActiveTeam() {
      return teams[currentTeamIndex];
    }

    function getInactiveTeam() {
      return teams[getNextTeamIndex()];
    }

    function switchActiveTeam() {
      if (!isFinished) {
        currentTeamIndex = getNextTeamIndex();
      }

      return getActiveTeam();
    }

    function nextTurn() {
      if (!isFinished) {
        turn++;
      }

      return turn;
    }

    function setIsFinished(status) {
      isFinished = status;
      return isFinished;
    }

    function getNextTeamIndex() {
      return (currentTeamIndex + 1) % teams.length;
    }

    function getWinner() {
      return isFinished ? getActiveTeam() : null;
    }

    return {
      isFinished: () => isFinished,
      getTurn: () => turn,
      getTurnHistory: () => turnHistory,
      getActiveTeam,
      getInactiveTeam,
      getWinner,
      start,
    };
  };
}

module.exports = { buildCreateFight };
