const { fetchRawAdventData } = require('../utils');

describe('fetchRawAdventData', () => {
  const VALID_DAY = 1;
  const DAY_1_URL = `https://adventofcode.com/2022/day/${VALID_DAY}/input`;
  const VALID_AUTH_HEADERS = { cookie: 'fake-cookie' };
  const FAKE_DATA = '123\n456\n789\n';
  const INVALID_DAY = 27;
  const FETCH_ERROR_404_MSG = '404 - not found';
  const INVALID_AUTH_HEADERS = { cookie: 'no-good' };
  const FETCH_ERROR_AUTH_MSG = 'Puzzle inputs differ by user.';
  const CUSTOM_AUTH_ERROR = 'Invalid authorisation';

  global.fetch = jest.fn((url, { headers }) => {
    // what a faff
    const validUrl = url === DAY_1_URL;
    const validAuth = headers === VALID_AUTH_HEADERS;

    return new Promise((resolve) => {
      resolve({
        text: () => {
          return new Promise((resolve, reject) => {
            if (!validAuth) resolve(FETCH_ERROR_AUTH_MSG);
            if (!validUrl) resolve(FETCH_ERROR_404_MSG);
            else resolve(FAKE_DATA);
          });
        },
        status: validUrl ? 200 : 404
      });
    });
  });

  beforeEach(() => {
    fetch.mockClear();
  });

  test('invokes fetch with the correct URL and auth headers', async () => {
    await fetchRawAdventData(VALID_DAY, VALID_AUTH_HEADERS);
    expect(fetch).toHaveBeenCalledWith(DAY_1_URL, {
      headers: VALID_AUTH_HEADERS
    });
  });
  test('returns raw data from given day', async () => {
    const data = await fetchRawAdventData(VALID_DAY, VALID_AUTH_HEADERS);
    expect(data).toBe(FAKE_DATA);
  });
  test('responds with fetch error given invalid day', async () => {
    await expect(
      fetchRawAdventData(INVALID_DAY, VALID_AUTH_HEADERS)
    ).rejects.toEqual(FETCH_ERROR_404_MSG);
  });
  test('responds with custom error given bad auth', async () => {
    await expect(
      fetchRawAdventData(VALID_DAY, INVALID_AUTH_HEADERS)
    ).rejects.toEqual(CUSTOM_AUTH_ERROR);
  });
});
