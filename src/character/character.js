function buildCreateCharacter({ calculateStamina, selectAttack }) {
  return function createCharacter({
    alignment,
    id,
    name,
    combat,
    durability,
    intelligence,
    power,
    speed,
    strength,
  }) {
    const baseStats = {
      combat,
      durability,
      intelligence,
      power,
      speed,
      strength,
    };

    if (!id) {
      throw new Error('Character must have an id');
    }

    if (!name) {
      throw new Error('Character must have a name');
    }

    if (!alignment) {
      throw new Error('Character must have an alignment');
    }

    if (!areValidBaseStats()) {
      throw new Error('All stats must be numbers');
    }

    const stamina = calculateStamina();
    let hp = calculateInitialHp();
    let filiationCoef = 0;
    const stats = {
      combat: 0,
      durability: 0,
      intelligence: 0,
      power: 0,
      speed: 0,
      strength: 0,
    };

    function areValidBaseStats() {
      const stats = Object.keys(baseStats);

      for (let i = 0; i < stats.length; i++) {
        const currentStat = stats[i];

        if (!isNumber(baseStats[currentStat])) {
          return false;
        }
      }

      return true;
    }

    function calculateInitialHp() {
      const BASE_HP = 100;
      const STRENGTH_WEIGHT = 0.8;
      const DURABILITY_WEIGHT = 0.7;
      const STATS_MODIFIER = 0.5;
      const STAMINA_WEIGHT = 0.1;
      const BASE_STAMINA = 1;
      const weightedStats =
        (strength * STRENGTH_WEIGHT + durability * DURABILITY_WEIGHT + power) *
        STATS_MODIFIER;
      const weightedStamina = BASE_STAMINA + stamina * STAMINA_WEIGHT;
      return weightedStats * weightedStamina + BASE_HP;
    }

    function takeDamage(dmg) {
      hp = Math.max(hp - dmg, 0);
      return hp;
    }

    // All attack methods look similar and that's okay. We shouldn't abstract them
    // in an attack factory because they can change independently from each other.
    function mentalAttack() {
      const INTELLIGENCE_WEIGHT = 0.7;
      const SPEED_WEIGHT = 0.2;
      const COMBAT_WEIGHT = 0.1;
      const weightedIntelligence = stats.intelligence * INTELLIGENCE_WEIGHT;
      const weightedSpeed = stats.speed * SPEED_WEIGHT;
      const weightedCombat = stats.combat * COMBAT_WEIGHT;

      return (
        (weightedIntelligence + weightedSpeed + weightedCombat) * filiationCoef
      );
    }

    function strongAttack() {
      const STRENGTH_WEIGHT = 0.6;
      const POWER_WEIGHT = 0.2;
      const COMBAT_WEIGHT = 0.2;
      const weightedStrength = stats.strength * STRENGTH_WEIGHT;
      const weightedPower = stats.power * POWER_WEIGHT;
      const weightedCombat = stats.combat * COMBAT_WEIGHT;

      return (
        (weightedStrength + weightedPower + weightedCombat) * filiationCoef
      );
    }

    function fastAttack() {
      const SPEED_WEIGHT = 0.55;
      const DURABILITY_WEIGHT = 0.25;
      const STRENGTH_WEIGHT = 0.2;
      const weightedSpeed = stats.speed * SPEED_WEIGHT;
      const weightedIntelligence = stats.durability * DURABILITY_WEIGHT;
      const weightedStrength = stats.strength * STRENGTH_WEIGHT;

      return (
        (weightedIntelligence + weightedSpeed + weightedStrength) *
        filiationCoef
      );
    }

    function recover() {
      hp = calculateInitialHp();
      return hp;
    }

    function isDefeated() {
      return hp === 0;
    }

    function setFightStatsAndAttacks({
      filiationCoef: calculatedFiliationCoef,
    }) {
      if (!isNumber(calculatedFiliationCoef)) {
        throw new Error('Filiation coeficient must be a number');
      }

      filiationCoef = calculatedFiliationCoef;

      Object.keys(stats).forEach(function setFightStat(stat) {
        stats[stat] = calculateFightStat(baseStats[stat]);
      });
    }

    function calculateFightStat(stat) {
      const STAT_WEIGHT = 2;
      const STAT_MODIFIER = 1.1;
      return ((STAT_WEIGHT * stat + stamina) / STAT_MODIFIER) * filiationCoef;
    }

    function isReadyToFight() {
      return filiationCoef !== 0;
    }

    function performRandomAttack() {
      const selectedAttack = selectAttack([
        mentalAttack,
        strongAttack,
        fastAttack,
      ]);
      return selectedAttack();
    }

    function isNumber(arg) {
      return typeof arg === 'number';
    }

    return Object.freeze({
      getAlignment: () => alignment,
      getId: () => id,
      getName: () => name,
      getCombat: () => stats.combat,
      getDurability: () => stats.durability,
      getIntelligence: () => stats.intelligence,
      getPower: () => stats.power,
      getSpeed: () => stats.speed,
      getStrength: () => stats.strength,
      getStamina: () => stamina,
      getHP: () => hp,
      mentalAttack,
      strongAttack,
      fastAttack,
      setFightStatsAndAttacks,
      takeDamage,
      recover,
      isDefeated,
      isReadyToFight,
      performRandomAttack,
    });
  };
}

module.exports = { buildCreateCharacter };
