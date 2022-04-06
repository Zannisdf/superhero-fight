const { createCharacter } = require('../../character');
const { createFight } = require('../../fight');
const { createTeam } = require('../../team');

function buildDoFight({ characterService, getCharacterIds, randomize }) {
  return async function doFight() {
    const characters = await getTeamsCharacters();
    const teams = distributeInTeams(characters);
    const fight = createFight({ teams });

    fight.start();

    return Object.freeze({
      turns: fight.getTurn(),
      teams: teams.map(getTeamInfo),
      winner: getName(fight.getWinner()),
      history: fight.getTurnHistory(),
    });

    async function getTeamsCharacters() {
      const availableIds = await getCharacterIds();
      const validIds = getTeamsUniqueIds(availableIds);
      const info = await characterService.getCharactersInfo(validIds);

      return info.map(getCharacter);
    }

    function distributeInTeams(chars) {
      const teamSize = chars.length / 2;
      const charsByTeam = [chars.slice(0, teamSize), chars.slice(5)];

      return charsByTeam.map((charsInTeam) =>
        createTeam({ characters: charsInTeam })
      );
    }

    function getTeamInfo(team) {
      return {
        name: getName(team),
        members: team.getCharacters().map(getName),
      };
    }

    function getName(entity) {
      return entity.getName();
    }

    function getTeamsUniqueIds(ids) {
      const poolSize = ids.length;
      const uniqueIds = new Set();

      while (uniqueIds.size < 10) {
        const randomIdIndex = randomize({ ceil: poolSize });
        uniqueIds.add(ids[randomIdIndex]);
      }

      return Array.from(uniqueIds);
    }

    function getCharacter({
      id,
      name,
      powerstats: { intelligence, strength, speed, durability, power, combat },
      biography: { alignment },
    }) {
      return createCharacter({
        id: Number(id),
        intelligence: getValidStatValue(intelligence),
        strength: getValidStatValue(strength),
        speed: getValidStatValue(speed),
        durability: getValidStatValue(durability),
        power: getValidStatValue(power),
        combat: getValidStatValue(combat),
        alignment,
        name,
      });
    }

    // Some characters do not have fighting stats. By setting a default value we ensure all
    // of them can fight. Eventually we could disqualify if they don't meet the conditions,
    // but this will do for now.
    function getValidStatValue(value) {
      const MIN_STAT_VALUE = 1;
      return Number(value) || MIN_STAT_VALUE;
    }
  };
}

module.exports = { buildDoFight };
