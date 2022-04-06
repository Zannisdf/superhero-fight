function buildGetCharacterIds({ parse, characterService }) {
  return async function getCharacterIds() {
    const rawInfo = await characterService.getAvailableIds();
    const { findAll, getText } = parse(rawInfo);
    const elements = findAll('tbody tr td:first-child');
    return Array.from(elements, getText);
  };
}

module.exports = { buildGetCharacterIds };
