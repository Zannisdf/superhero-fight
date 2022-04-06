function buildCreateTeam({ calculateFiliationBonus }) {
  return function createTeam({ characters }) {
    const REQUIRED_TEAM_SIZE = 5;

    if (!Array.isArray(characters)) {
      throw new Error('Characters must be an array instance');
    }

    if (!isValidLength()) {
      throw new Error(`A team must contain ${REQUIRED_TEAM_SIZE} characters`);
    }

    if (!areCharactersUnique()) {
      throw new Error('A team can only have unique characters');
    }

    const name = determineName();
    const alignment = determineAlignment();
    let currentFighterIndex = 0;
    let isDefeated = false;

    function isValidLength() {
      return characters.length === REQUIRED_TEAM_SIZE;
    }

    function areCharactersUnique() {
      const ids = new Set(characters.map(getId));
      return ids.size === characters.length;
    }

    function determineName() {
      const [leader] = characters;
      return `${leader.getName()}'s team`;
    }

    function determineAlignment() {
      const alignmentCount = {};
      const teamAlignment = { value: 0, name: '' };

      characters.forEach(function countAlignment(character) {
        const charAlignment = character.getAlignment();
        const currentValue = alignmentCount[charAlignment] || 0;
        alignmentCount[charAlignment] = currentValue + 1;

        if (teamAlignment.value < currentValue) {
          teamAlignment.value = currentValue;
          teamAlignment.name = charAlignment;
        }
      });

      return teamAlignment.name;
    }

    function performAttack() {
      const currentFighter = getCurrentFighter();

      if (!currentFighter) {
        throw new Error('There are no more active fighters in the team!');
      }

      return {
        damage: currentFighter.performRandomAttack(),
        attacker: currentFighter.getName(),
      };
    }

    function takeDamage(damage) {
      const currentFighter = getCurrentFighter();

      if (!currentFighter) {
        throw new Error('There are no more active fighters in the team!');
      }

      return {
        hp: currentFighter.takeDamage(damage),
        defender: currentFighter.getName(),
      };
    }

    function prepareCurrentFighter() {
      const currentFighter = getCurrentFighter();

      if (!currentFighter.isReadyToFight()) {
        const filiationCoef = calculateFiliationCoef(
          currentFighter.getAlignment()
        );
        currentFighter.setFightStatsAndAttacks({ filiationCoef });
      }

      return currentFighter;
    }

    function isCurrentFighterDefeated() {
      return getCurrentFighter().getHP() === 0;
    }

    function calculateFiliationCoef(charAlignment) {
      const BASE_FILIATION_BONUS = 1;
      const ALIGNMENT_FACTOR = 1;
      const NON_ALIGNMENT_FACTOR = -1;
      const filiationBonus = BASE_FILIATION_BONUS + calculateFiliationBonus();
      const charAlignmentFactor =
        charAlignment === alignment ? ALIGNMENT_FACTOR : NON_ALIGNMENT_FACTOR;

      return Math.pow(filiationBonus, charAlignmentFactor);
    }

    function switchFighter() {
      currentFighterIndex++;
      const currentFighter = getCurrentFighter();

      if (!currentFighter) {
        setIsDefeated(true);
      }

      return currentFighter;
    }

    function getCurrentFighter() {
      return characters[currentFighterIndex] || null;
    }

    function getId(character) {
      return character.getId();
    }

    function setIsDefeated(status) {
      isDefeated = status;
      return isDefeated;
    }

    function recoverCurrentFighter() {
      const currentFighter = getCurrentFighter();
      return currentFighter.recover();
    }

    return Object.freeze({
      performAttack,
      takeDamage,
      getAlignment: () => alignment,
      getCharacters: () => characters,
      getName: () => name,
      isDefeated: () => isDefeated,
      getCurrentFighter,
      recoverCurrentFighter,
      switchFighter,
      prepareCurrentFighter,
      isCurrentFighterDefeated,
    });
  };
}

module.exports = { buildCreateTeam };
