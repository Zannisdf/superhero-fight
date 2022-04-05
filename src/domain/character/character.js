function buildCreateCharacter({ calculateStamina }) {
  return function createCharacter({
    alignment,
    id,
    combat = 0,
    durability = 0,
    filiationCoef,
    intelligence = 0,
    power = 0,
    speed = 0,
    strength = 0,
  }) {
    if (!id) {
      throw new Error('Character must have an id');
    }

    if (!alignment) {
      throw new Error('Character must have an alignment');
    }

    const stamina = calculateStamina();
    const fightStats = Object.freeze({
      combat: calculateFightStat(combat),
      durability: calculateFightStat(durability),
      intelligence: calculateFightStat(intelligence),
      power: calculateFightStat(power),
      speed: calculateFightStat(speed),
      strength: calculateFightStat(strength),
    });
    let hp = calculateInitialHp();

    function calculateFightStat(stat) {
      const STAT_WEIGHT = 2;
      const STAT_MODIFIER = 1.1;
      return ((STAT_WEIGHT * stat + stamina) / STAT_MODIFIER) * filiationCoef;
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
      const weightedIntelligence =
        fightStats.intelligence * INTELLIGENCE_WEIGHT;
      const weightedSpeed = fightStats.speed * SPEED_WEIGHT;
      const weightedCombat = fightStats.combat * COMBAT_WEIGHT;

      return (
        (weightedIntelligence + weightedSpeed + weightedCombat) * filiationCoef
      );
    }

    function strongAttack() {
      const STRENGTH_WEIGHT = 0.6;
      const POWER_WEIGHT = 0.2;
      const COMBAT_WEIGHT = 0.2;
      const weightedStrength = fightStats.strength * STRENGTH_WEIGHT;
      const weightedPower = fightStats.power * POWER_WEIGHT;
      const weightedCombat = fightStats.combat * COMBAT_WEIGHT;

      return (
        (weightedStrength + weightedPower + weightedCombat) * filiationCoef
      );
    }

    function fastAttack() {
      const SPEED_WEIGHT = 0.55;
      const DURABILITY_WEIGHT = 0.25;
      const STRENGTH_WEIGHT = 0.2;
      const weightedSpeed = fightStats.speed * SPEED_WEIGHT;
      const weightedIntelligence = fightStats.durability * DURABILITY_WEIGHT;
      const weightedStrength = fightStats.strength * STRENGTH_WEIGHT;

      return (
        (weightedIntelligence + weightedSpeed + weightedStrength) *
        filiationCoef
      );
    }

    return Object.freeze({
      getAlignment: () => alignment,
      getId: () => id,
      getCombat: () => fightStats.combat,
      getDurability: () => fightStats.durability,
      getIntelligence: () => fightStats.intelligence,
      getPower: () => fightStats.power,
      getSpeed: () => fightStats.speed,
      getStrength: () => fightStats.strength,
      getStamina: () => stamina,
      getHP: () => hp,
      mentalAttack,
      strongAttack,
      fastAttack,
      takeDamage,
    });
  };
}

module.exports = { buildCreateCharacter };
