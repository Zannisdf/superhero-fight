function buildLogFight() {
  return function logFight({ turns, teams, winner, history }) {
    const events = [
      ...getFightStartMessage(),
      ...getTurns(),
      ...getFightEndMessage(),
    ];

    return stringify(events);

    function getFightStartMessage() {
      const [teamA, teamB] = teams;
      return [
        'A new fight is starting!',
        `${teamA.name} is fighting ${teamB.name}!`,
        `Fighting for ${teamA.name} are: ${getMembers(teamA)}.`,
        `For ${teamB.name} we have ${getMembers(teamB)}.`,
        `Get ready!!!`,
      ];
    }

    function getTurns() {
      const turnEvents = [];
      history.forEach(function getTurnLog({
        id,
        attacker,
        damage,
        defender,
        hp,
      }) {
        turnEvents.push(
          '------------------',
          `Starting turn ${id}`,
          `${attacker} hits ${defender} for ${Math.ceil(damage)}!`,
          `${defender}'s remaining hp is ${Math.ceil(hp)}.`
        );

        if (hp === 0) {
          turnEvents.push(`${defender} has been defeated!`);
        }

        turnEvents.push(`Ending turn ${id}`, '------------------');
      });

      return turnEvents;
    }

    function getFightEndMessage() {
      return [
        `The fight has ended on turn ${turns}!`,
        `The winner is ${winner}`,
      ];
    }

    function stringify(events) {
      return events.join('\n');
    }

    function getMembers(team) {
      return team.members.join(', ');
    }
  };
}

module.exports = { buildLogFight };
