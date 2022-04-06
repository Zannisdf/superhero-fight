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
      const attackingTeam = getAttackingTeam();
      const defendingTeam = getDefendingTeam();

      attackingTeam.prepareCurrentFighter();
      const { attacker, damage } = attackingTeam.performAttack();
      const { defender, hp } = defendingTeam.takeDamage(damage);

      if (defendingTeam.isCurrentFighterDefeated()) {
        attackingTeam.recoverCurrentFighter();
        defendingTeam.switchFighter();
      }

      if (defendingTeam.isDefeated()) {
        setIsFinished(true);
      }

      const turnStats = { id: turn, attacker, damage, defender, hp };
      turnHistory.push(turnStats);

      switchAttackingTeam();
      nextTurn();

      return turnStats;
    }

    function getAttackingTeam() {
      return teams[currentTeamIndex];
    }

    function getDefendingTeam() {
      return teams[getNextTeamIndex()];
    }

    function switchAttackingTeam() {
      if (!isFinished) {
        currentTeamIndex = getNextTeamIndex();
      }

      return getAttackingTeam();
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
      return isFinished ? getAttackingTeam() : null;
    }

    return Object.freeze({
      isFinished: () => isFinished,
      getTurn: () => turn,
      getTurnHistory: () => turnHistory,
      getAttackingTeam,
      getDefendingTeam,
      getWinner,
      start,
    });
  };
}

module.exports = { buildCreateFight };
