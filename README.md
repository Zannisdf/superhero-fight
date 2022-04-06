# Superhero fight

Superhero fight is an application that simulates a turn based teamfight between two teams of five characters each, which are randomly chosen from a hero pool and must be unique in the fight.

See it in action here:

- https://superhero-fight.herokuapp.com/fight for the fight simulation
- https://superhero-fight.herokuapp.com/api/fight for the fight simulation data

### Fight rules

- The teams are be named after its first chosen character. E.g. if the first character is Batman, the team name will be Batman's team.
- Teams take turns to attack and defend. In both cases, their first character with HP greater than zero is considered active and deal or take damage accordingly.
- If a character's HP is depleted after being attacked, they cannot longer fight and the defending team sets its next character as the active one.
- If an attacker defeats a character, their HP is restored.
- After an attack, teams switch roles.
- A team is defeated when all its characters are defeated.

### Development

#### Setup

- Install [Node.js](https://nodejs.org/)
  - Recommended method is by using [NVM](https://github.com/creationix/nvm)
  - Recommended Node.js version is the [latest v14 LTS](https://nodejs.org/download/release/latest-v14.x/)
- Make sure you're using `npm@6.x` by running `npm i -g npm@6`
- Run `cp .env.example .env` and replace the `API_KEY` value with a valid key for the [Superhero api](https://www.superheroapi.com/).

You may find convenient editing your `.bash_profile` or `.zshrc` to [auto pick the Node version](https://github.com/mercadolibre/frontend/wiki/Auto-Picking-Node-version) of each project.

#### Running the app locally

Start the app by running

```bash
yarn dev
```

Keep in mind that the application will restart everytime a file changes for ease of development.

#### Testing

Execute all tests by running

```bash
yarn test
```

During development it is recommended to run the tests in watch mode to prevent any unnoticed breaking changes.

```bash
yarn test:watch
```

### Documentation

This is a sample application built following clean architecture patterns in order to separate the business logic from the implementation details.

Since the app is not meant to scale or grow, the folder structure is intended to be as flat as possible while still being expressive enough for people to understand what the app is about in a glance.

Each folder follows a module pattern with at least two files.

- A file for the module's implementation with a descriptive name, where all major logic should be placed. E.g. `log-fight.js`.
- An `index.js` file where we and inject all dependencies needed and export what we want from the module. This file **must not** contain major logic.
  This pattern allows us to keep our imports clean without exposing the module's internal file structure, e.g. instead of `require('../log-fight/fight')` we can just simply do `require('../log-fight')`.

Most modules are simple curried javascript factory functions which allow us to inject dependencies. We prefer this over classes since these modules are not meant to be extended using inheritance, but rather composition if needed.
While some modules don't have any dependencies, we still export a factory function for consistency.
