const { buildGetCharacterIds } = require('../get-character-ids');

describe('getCharacterIds()', () => {
  it('returns an array containing the available character ids from the service', async () => {
    const parse = mockParse;
    const characterService = mockCharacterService();
    const getCharacterIds = buildGetCharacterIds({
      parse,
      characterService,
    });
    const html = 'Some html';
    characterService.getAvailableIds.mockImplementation(() =>
      Promise.resolve(html)
    );

    const result = await getCharacterIds();

    expect(result).toStrictEqual(['Some', 'html']);
  });
});

function mockParse(html) {
  return {
    findAll: jest.fn().mockImplementation(() => html.split(' ')),
    getText: jest.fn().mockImplementation((data) => data),
  };
}

function mockCharacterService() {
  return {
    getAvailableIds: jest.fn(),
  };
}
