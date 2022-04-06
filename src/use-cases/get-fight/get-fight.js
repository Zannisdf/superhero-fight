const { createCharacter } = require('../../character');
const { createFight } = require('../../fight');
const { createTeam } = require('../../team');

function buildGetFight({ characterService, getCharacterIds, randomize }) {
  return async function getFight() {
    const characters = await getTeamsCharacters();
    const teams = distributeInTeams(characters);
    const fight = createFight({ teams });

    fight.start();

    return {
      turns: fight.getTurn(),
      teams: teams.map(getTeamInfo),
      winner: getName(fight.getWinner()),
      history: fight.getTurnHistory(),
    };

    async function getTeamsCharacters() {
      const availableIds = await getCharacterIds();
      const validIds = getTeamsUniqueIds(availableIds);
      const info = await characterService.getCharactersInfo(validIds);

      return info.map(createCharacter);
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
  };
}

module.exports = { buildGetFight };
